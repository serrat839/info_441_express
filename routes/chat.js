import express from 'express';
import path from 'path';
// import enableWS from 'express-ws'

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
  // past x messages chached???
  let logs = new ChatHistory(20)
  _chat.on("connection", (socket) => {
    // todo: update this to work with firebase
    let user;
    if(socket.request.session.screenName)
    {
      user = socket.request.session.screenName;
    }
    else{
      user = socket.request.session.id;
    }
    
    users.add(user)
    // join chatroom
    socket.join("chat")
    // to everyone update userlist
    socket.in("chat").emit("users", Array.from(users))
    console.log("sending to user...")
    socket.emit("joining", Array.from(users), logs.getLog())

    // chat messages
    socket.on("chat message", (msg) => {
      socket.to('chat').emit("cr", msg, (socket.request.session.screenName ? socket.request.session.screenName : socket.request.session.id))
      socket.emit("cr2", msg, (socket.request.session.screenName ? socket.request.session.screenName : socket.request.session.id))
      logs.add({user: (socket.request.session.screenName ? socket.request.session.screenName : socket.request.session.id), "msg": msg})
    })
    // in the room actively
    socket.on("disconnect", () => {
      // resend the user list
      console.log("bye")
      users.delete(user)
    })
  })
    return router
}

export default createRouter;
