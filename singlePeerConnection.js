/** A reliable data connection to a single peer. */
class SinglePeerConnection {

    constructor(client, peerID, initiator, iceServers) {

        this.client = client
        this.peerID = peerID
        this.iceServers = iceServers

        // Create a RTCPeerConnection.
        this.peerConnection = new RTCPeerConnection({
            iceServers: this.iceServers
        })

        // Close the connection if the browser page is closed.
        window.addEventListener("beforeunload", e => {
            this.peerConnection.close()
            this.dataChannel?.close()
        })

        // Send out candidate messages as we generate ICE candidates.
        this.peerConnection.onicecandidate = event => {
            if (event.candidate) {
                this.client.send(JSON.stringify({
                    kind: "send-message",
                    type: "candidate",
                    destinationID: peerID,
                    payload: event.candidate
                }))
            }
        }

        this.peerConnection.onconnectionstatechange = event => {
            console.log(`ConnectionStateChange: ${this.peerConnection.connectionState}`)
            if (this.peerConnection.connectionState === "disconnected") {
                this.close()
            }
        }

        if (initiator) {
            // Invoked when we are ready to negotiate.
            this.peerConnection.onnegotiationneeded = async () => {
                // Create an offer and send to our peer.
                const offer = await this.peerConnection.createOffer()
                this.client.send(JSON.stringify({
                    kind: "send-message",
                    type: "offer",
                    destinationID: peerID,
                    payload: offer
                }))

                // Install this offer locally.
                await this.peerConnection.setLocalDescription(offer)
            }

            // Create a reliable data channel.
            this.setDataChannel(
                this.peerConnection.createDataChannel("data", {
                    ordered: true
                })
            )
        } else {
            this.peerConnection.ondatachannel = event => {
                this.setDataChannel(event.channel)
            }
        }
    }

    close() {
        this.peerConnection.close()
        this.dataChannel?.close()
    }

    setDataChannel(dataChannel) {
        this.dataChannel = dataChannel
        this.dataChannel.binaryType = "arraybuffer"
        this.dataChannel.onopen = e => {
            console.log("OPEN", this.peerID)

            const otherConnections =
                Array.from(connections.keys()).filter(peerId => peerId !== this.peerID)
            this.send({
                type: "connections",
                value: otherConnections
            })
        }
        this.dataChannel.onmessage = e => {
            const msg = JSON.parse(e.data)
            if (msg.type === 'connections') {
                const targetConnections = msg.value.filter(connection => !connections.has(connection))
                console.log("additional connections", targetConnections)
                for (const targetConnection of targetConnections) {
                    const connection = new SinglePeerConnection(ws, targetConnection, true, this.iceServers);
                    connections.set(targetConnection, connection);
                }
            }
            if (msg.type === 'chat') {
                chatElement = document.getElementById('chat')
                chatElement.value = msg.value
            }
        }
        this.dataChannel.onclose = e => {
            console.log("CLOSE", e)
        }
    }

    async onSignalingMessage(type, payload) {
        console.log(`onSignalingMessage: ${type}, ${JSON.stringify(payload)}`)
        if (type === "offer") {
            // Set the offer as our remote description.
            await this.peerConnection.setRemoteDescription(payload)

            // Generate an answer and set it as our local description.
            console.log("Generating answer...")
            const answer = await this.peerConnection.createAnswer()
            await this.peerConnection.setLocalDescription(answer)

            // Send the answer back to our peer.
            this.client.send(JSON.stringify({
                kind: "send-message",
                type: "answer",
                destinationID: this.peerID,
                payload: answer
            }))
        } else if (type === "answer") {
            // Set the answer as our remote description.
            await this.peerConnection.setRemoteDescription(payload)
        } else if (type === "candidate") {
            // Add this ICE candidate.
            await this.peerConnection.addIceCandidate(payload)
        }
    }

    send(data) {
        if (this.dataChannel?.readyState !== "open") return
        this.dataChannel.send(JSON.stringify(data))
    }
}
