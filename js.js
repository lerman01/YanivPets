let chatElement;

const urlParams = new URLSearchParams(window.location.search);
const hostId = urlParams.get('hostId');
let clientId;
addEventListener('DOMContentLoaded', () => {
    document.getElementById('startGame').onclick = () => {
        ws.send(`{"kind":"match-request","gameID":"${crypto.randomUUID()}","minPlayers":1,"maxPlayers":1}`)
    }
    const logElement = document.getElementById('logs')
    const originalLog = console.log;
    console.log = (...input) => {
        if (input[0]) {
            logElement.textContent += input[0]
        }
        if (input[1]) {
            logElement.textContent += " " + JSON.stringify(input[1])
        }
        logElement.textContent += '\n-------------------------\n'
        originalLog(...input)
    }
    chatElement = document.getElementById('chat')
    chatElement.oninput = (e) => {
        const iterator = connections.values()
        let peerConnection = iterator.next().value
        while (peerConnection) {
            if (peerConnection) {
                peerConnection.send({
                    type: "chat",
                    value: e.target.value
                })
            }
            peerConnection = iterator.next().value
        }
    }
})


const connections = new Map();
let iceServers = [];

const signalingServerURL = 'wss://netplayjs.varunramesh.net/';
const ws = new WebSocket(signalingServerURL);

ws.onopen = () => {
    console.log('Connected to the signaling server');
};

ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
};

ws.onmessage = (message) => {
    const msg = JSON.parse(message.data)
    console.log(`Server -> Client`, msg);

    if (msg.kind === "registration-success") {
        iceServers = msg.iceServers;
        clientId = msg.clientID
        const child = document.createElement('div');
        child.innerHTML = `${window.location.href.split('?')[0]}?hostId=${clientId}`;
        document.body.appendChild(child)

        if (hostId) {
            const connection = new SinglePeerConnection(ws, hostId, true, iceServers);
            connections.set(hostId, connection);
        }
    } else if (msg.kind === "peer-message") {
        // We've received a peer message. Check if we already have a
        // matching PeerConnection.

        if (!connections.has(msg.sourceID)) {
            // Create the connection and emit it.
            const connection = new SinglePeerConnection(ws, msg.sourceID, false, iceServers);
            connections.set(msg.sourceID, connection);
        }
        // // Forward the signaling message to our peer.
        connections.get(msg.sourceID).onSignalingMessage(msg.type, msg.payload);
    }
    // else if (msg.kind === "host-match") {
    //
    // } else if (msg.kind === "join-match") {
    //     const connection = new PeerConnection(ws, msg.hostID, true, iceServers);
    //     connections.set(msg.hostID, connection);
    // }
}

const startNewGame = () => {

}
