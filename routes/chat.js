import express from 'express';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ChatHistory from '../modules/chatHistory.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createRouter(io, sharedsesh) {
  var router = express.Router();
  const _chat = io.of("/chat")
  _chat.use((socket, next) => {
    sharedsesh(socket.request, {}, next)
  })
  /* GET home page. */
  router.get('/', function(req, res, next) {
      res.sendFile(path.join(__dirname,'/../public/chat.html'));
  });

  const users = new Set();
  let logs = new ChatHistory(20)
  _chat.on("connection", async (socket) => {
    let user;
    let clownsona;
    if(socket.request.session.screenName)
    {
      user = socket.request.session.screenName;
      clownsona = socket.request.session.sonanumber;
    }
    else{
      user = `Guest ${users.size}`
    }
    let usertoken = {user: user, clownsona: clownsona}
    users.add(usertoken)
    // join chatroom
    socket.join("chat")
    // to everyone update userlist
    socket.in("chat").emit("users", Array.from(users))
    socket.emit("joining", Array.from(users), logs.getLog())

    // chat messages
    socket.on("chat message", (msg) => {
      let payload = {
        "msg": msg,
        "user": user
      }
      socket.to('chat').emit("cr", payload)
      socket.emit("cr2", payload)
      logs.add(payload)
    })
    // in the room actively
    socket.on("disconnect", () => {
      // resend the user list
      console.log("bye")
      users.delete(usertoken)
    })
  })
    return router
}

export default createRouter;
