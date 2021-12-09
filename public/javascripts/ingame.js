window.addEventListener('load', event => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    const clownsonaUrl = "https://www.clowntown.me/clownsonas/clown"
    var socket = io("/ingame", {query: `gameId=${urlParams.get("gameId")}&uid=${urlParams.get("uid")}`});
    function buildClownsonaUrl(clown) {
        return clownsonaUrl + clown + ".svg"
    }
    function sendMsg(){
        socket.emit("move", '')
    }
    document.getElementById("sendBtn").addEventListener("click", sendMsg)
    function positionFlag(score) {
        let flag = document.getElementById("flag")
        let position = 50
        let step = position / 20
        step = score * step
        position = position + step
        flag.style.left = `${position}%`
    }
    socket.on("roles", async (msg) => {
        msg = await JSON.parse(msg)
        console.log(msg)
        // now fetch everyone's clownsona...
        let left_clownsona = buildClownsonaUrl(msg.leftclownsona)
        let right_clownsona = buildClownsonaUrl(msg.rightclownsona)
        console.log(left_clownsona)
        document.getElementById("player-a").innerText = msg.minus ? `You: ${msg.left}` : msg.left
        document.getElementById("player-b").innerText = !msg.minus ? `You: ${msg.right}` : msg.right
        document.getElementById("player-a-img").src = left_clownsona
        document.getElementById("player-b-img").src = right_clownsona
        positionFlag(msg.score)
    })
    socket.on("gameover",  async (msg) => {
        msg = await JSON.parse(msg)
        try {
            document.getElementById("output").innerHTML = msg.winner
        } catch (err) {
            console.log(err)
        }
    })
    socket.on("play",  async (msg) => {
        msg = await JSON.parse(msg)
        try {
            positionFlag(msg.value)
        } catch (err) {
            console.log(err)
        }
    })
    socket.on("fatal", async (msg) => {
        // maybe switch some flags around? idk.
        document.getElementById("center").innerHTML = msg
    })
})