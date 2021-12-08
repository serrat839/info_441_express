// sends that the game does not exist to the user and then disconnects their socket
export default function gameDNE(socket, msg) {
    socket.emit("fatal", msg)
    socket.disconnect(0)
}