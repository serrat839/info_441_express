const clownsonaUrl = 'https://www.clowntown.me/clownsonas/clown'
window.addEventListener('load', (event) => {
    let automove = true;
    let chat = document.getElementById("chatResults")
    chat.addEventListener('scroll', (e) => {
        if ( Math.floor(chat.scrollTop) == Math.floor(chat.scrollHeight - chat.clientHeight)){
            automove = true
        } else{
            automove = false
        }
    })
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    var socket = io("/chat");
    function updateChat(msg) {
        let chat = document.getElementById('chatResults')
        let new_msg = `<p>${msg.user}: ${msg.msg} </p>`
        chat.innerHTML = chat.innerHTML + new_msg
        if (automove) {
            chat.scrollTo(0, chat.scrollHeight)
        }
    }
    function updateLog(arr) {
        arr.forEach(item => {
            updateChat(item)
        })
    }
    function updateUsers(arr) {
        let users = document.getElementById("activeUsers")
        users.innerHTML = ""
        let html = ""
        arr.forEach(item => {
            let clownsona;
            if (item.clownsona) {
                clownsona = clownsonaUrl + item.clownsona + ".svg"
            } else {
                clownsona = clownsonaUrl + "guest.svg"
            }
            html += `<div class="activeusers">
                <img src="${clownsona}" class="usersidebar">
                <p>${item.user}</p>
                </div>`
        })
        users.innerHTML = html
    }
    function sendMsg() {
        let textBox = document.getElementById("textInput")
        socket.emit("chat message", textBox.value)
        textBox.value = ""
        let chat = document.getElementById('chatResults')
        chat.scrollTo(0, chat.scrollHeight)
    }
    document.getElementById("sendBtn").addEventListener("click", (e) => {
        sendMsg()
    })
    socket.on("cr", async (msg) => {
        console.log(msg)
        updateChat(msg)
    })
    socket.on("cr2", async (msg) => {
        console.log(msg)
        updateChat(msg)
    })

    socket.on("users", async (users) => {
        console.log(users)
        updateUsers(users)
    })
    socket.on("joining", async (users, log) => {
        console.log(users)
        updateUsers(users)
        updateLog(log)
    })
})