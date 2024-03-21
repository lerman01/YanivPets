
const test = () =>{
    const peerConnection = connections.values().next().value
    peerConnection.send('YANIV TEST')
}
addEventListener('DOMContentLoaded', () => {
    document.getElementById('startGame').onclick = () => {
        ws.send('{"kind":"match-request","gameID":"BLIBLA","minPlayers":2,"maxPlayers":2}')
    }
    const logElement = document.getElementById('logs')
    const originalLog = console.log;
    console.log = (...input)=> {
        logElement.textContent += input + '\n'
        originalLog(...input)
    }
})


const connections = new Map();
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

        if (!connections.has(msg.sourceID)) {
            // Create the connection and emit it.
            const connection = new PeerConnection(ws, msg.sourceID, false, iceServers);
            connections.set(msg.sourceID, connection);
        }
        // Forward the signaling message to our peer.
        connections.get(msg.sourceID).onSignalingMessage(msg.type, msg.payload);
    } else if (msg.kind === "host-match") {

    } else if (msg.kind === "join-match") {
        const connection = new PeerConnection(ws, msg.hostID, true, iceServers);
        connections.set(msg.hostID, connection);

    }

}

ws.onopen = () => {
    console.log('Connected to the signaling server');
};

ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
};
