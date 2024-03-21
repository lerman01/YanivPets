addEventListener('DOMContentLoaded', ()=> {
    document.getElementById('startGame').onclick = () => {
        ws.send('{"kind":"match-request","gameID":"https://rameshvarun.github.io/netplayjs/pong/","minPlayers":2,"maxPlayers":2}')
    }
})


const connections = [];
let iceServers = [];

const signalingServerURL = 'wss://netplayjs.varunramesh.net/';
const ws = new WebSocket(signalingServerURL);
ws.onmessage = (message) => {
    const msg = JSON.parse(message.data)
    console.log(`Server -> Client`, msg);

    if (msg.kind === "registration-success") {
        iceServers = msg.iceServers;
    } else if (msg.kind === "peer-message") {
        // We've received a peer message. Check if we already have a
        // matching PeerConnection.

        if (!connections.includes(msg.sourceID)) {
            // Create the connection and emit it.
            // const connection = new PeerConnection(this, msg.sourceID, false);
            // this.connections.set(msg.sourceID, connection);
            // this.onConnection.emit(connection);

            const peerConnection = new RTCPeerConnection({
                iceServers,
            });

            peerConnection.onicecandidate = (event) => {
                console.log("AAAA")
                if (event.candidate) {
                    // this.client.send({
                    //     kind: "send-message",
                    //     type: "candidate",
                    //     destinationID: peerID,
                    //     payload: event.candidate,
                    // });
                }
            };

            peerConnection.onconnectionstatechange = (event) => {
                console.log("BBBBB")
                // log.debug(
                //     `ConnectionStateChange: ${this.peerConnection.connectionState}`
                // );
                if (peerConnection.connectionState === "disconnected") {
                    console.log("CCCCC")
                    // this.close();
                }
            };

            peerConnection.ondatachannel = (event) => {
                console.log("FFFFFFFF")
            };
            connections.push(msg.sourceID)
        }

        // Forward the signaling message to our peer.
        //         this.connections
        //             .get(msg.sourceID)!
        //     .onSignalingMessage(msg.type, msg.payload);
    } else if (msg.kind === "host-match") {
        //         // The server is telling us to host a match.
        //         this.onHostMatch.emit({
        //             clientIDs: msg.clientIDs,
        //         });

        // const peerConnection = new RTCPeerConnection({
        //     iceServers,
        // });
        //
        // peerConnection.onicecandidate = (event) => {
        //         console.log("AAAA")
        //     if (event.candidate) {
        //         // this.client.send({
        //         //     kind: "send-message",
        //         //     type: "candidate",
        //         //     destinationID: peerID,
        //         //     payload: event.candidate,
        //         // });
        //     }
        // };
        //
        // peerConnection.onconnectionstatechange = (event) => {
        //     console.log("BBBBB")
        //     // log.debug(
        //     //     `ConnectionStateChange: ${this.peerConnection.connectionState}`
        //     // );
        //     if (peerConnection.connectionState === "disconnected") {
        //         console.log("CCCCC")
        //         // this.close();
        //     }
        // };
        //
        // peerConnection.ondatachannel = (event) => {
        //     console.log("DDDDD")
        // };
        // peerConnection.onnegotiationneeded = async () => {
        //     // Create an offer and send to our peer.
        //     // const offer = await this.peerConnection.createOffer();
        //     // this.client.send({
        //     //     kind: "send-message",
        //     //     type: "offer",
        //     //     destinationID: peerID,
        //     //     payload: offer,
        //     // });
        //     console.log('EEEEEEEEEEE')
        // }
    } else if (msg.kind === "join-match") {
        // The server is telling us to join a match.
        const peerConnection = new RTCPeerConnection({
            iceServers,
        });

        peerConnection.onicecandidate = (event) => {
            console.log("AAAA")
            // if (event.candidate) {
            // this.client.send({
            //     kind: "send-message",
            //     type: "candidate",
            //     destinationID: peerID,
            //     payload: event.candidate,
            // });
            // }
        };

        peerConnection.onconnectionstatechange = (event) => {
            console.log("BBBBB")
            // log.debug(
            //     `ConnectionStateChange: ${this.peerConnection.connectionState}`
            // );
            if (peerConnection.connectionState === "disconnected") {
                console.log("CCCCC")
                // this.close();
            }
        };

        peerConnection.ondatachannel = (event) => {
            console.log("DDDDD")
        };

        peerConnection.onnegotiationneeded = async () => {
            // Create an offer and send to our peer.
            console.log('Create offer for host')
            const offer = await peerConnection.createOffer();
            ws.send(JSON.stringify({
                kind: "send-message",
                type: "offer",
                destinationID: msg.hostID,
                payload: offer,
            }));
        }
        const dataChannel = peerConnection.createDataChannel("data", {
            ordered: true,
        })

        dataChannel.binaryType = "arraybuffer";
        dataChannel.onopen = (e) => {
            // this.emit("open");
        };
        dataChannel.onmessage = (e) => {
            console.log("BABABABA")
            // this.receiveStats.onMessage(e.data.byteLength);
            // this.emit("data", msgpack.decode(new Uint8Array(e.data as ArrayBuffer)));
        };

        dataChannel.onclose = (e) => {
            console.log("CDCDCDCD")
            console.log("Data channel closed...");
            // this.close();
        };

    }

}

ws.onopen = () => {
    console.log('Connected to the signaling server');
};

ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
};
