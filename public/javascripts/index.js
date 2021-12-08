window.addEventListener('load', event => {
    var socket = io("/queue");
    let myfunc = async function() {
        socket.on("redir", async (msg) => {
            msg = await JSON.parse(msg)
            if (msg.type == "redirect") {
                document.getElementById("status").innerHTML="An enemy clown has been found!!"
                setTimeout(function() {
                    window.location.href = msg.url + `?gameId=${msg.gameid}&uid=${msg.userId}`;
                }, 1000)
            }
        })
    }
    myfunc();
    let numDots = 2
    let dot = "🤡"
    function dotter() {
        try{
            let container = document.getElementById("dots")
            container.innerText = dot.repeat(numDots)
            numDots++
            if (numDots > 3) {
                numDots = 1
            }
        } catch (err) {
            console.log("what?")
        }
    }
    setInterval(dotter, 1000)
})