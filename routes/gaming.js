import express from 'express';
import path from 'path';
import fetch from "node-fetch";
// import enableWS from 'express-ws'

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import Queue from '../modules/queue.js'
import e from 'express';
import gameDNE from '../modules/gameDNE.js';

function createRouter(io, sharedsesh) {
  var router = express.Router();
  const _queue = io.of("/queue")
  _queue.use((socket, next) => {
    sharedsesh(socket.request, {}, next)
  })
  const _ingame = io.of("/ingame")
  _ingame.use((socket, next) => {
    sharedsesh(socket.request, {}, next)
  })
  /* GET home page. */
  router.get('/', function (req, res, next) {
    // check that they're a valid player in the game...
    // use auth tokens for this
    //console.log(req.query)
    res.sendFile(path.join(__dirname, '/../public/ingame.html'));
  });

  // gamesize
  const GAME_SIZE = 2
  // // the queue itself
  let queue = new Queue(GAME_SIZE)
  // game id to direct ppl
  let gameid = 0
  // active games
  let games = new Map()

  _queue.on("connection", (socket) => {
    // add someone to the queue
    let id_player;
    let report;
    let screenName;
    if (socket.request.session.user) {
      id_player = socket.request.session.user;
      report = true;
    }
    else {
      id_player = socket.request.session.id;
      report = false;
    }
    if (socket.request.session.screenName) {
      screenName = socket.request.session.screenName;
    }
    else {
      screenName = `Guest ${queue.length}`;
    }
    let userData = {
      "socket": socket,
      // TODO REPLACE THIS WITH USER AUTH
      "session_id": id_player,
      "report": report,
      "screenName": screenName
    };
    queue.enqueue(userData)
    // if two or more people are connected, pop them from the dict and send them to a game
    if (queue.length >= GAME_SIZE) {
      // obj to redirect to game page
      // get the array of players from the queue
      let players = queue.popQueue()
      let gameData = []
      players.forEach(item => {
        // users are not connected to the game
        gameData.push({
          // TODO: REPLACE WITH USER AUTH
          "user": item.session_id,
          "connected": item.report,
          "screenName":item.screenName
        })
        // send the user the redirect info
        item.socket.broadcast.emit("redirect", JSON.stringify({
          type: "redirect",
          url: "/gaming",
          // TODO: REPLACE WITH USER AUTH
          userId: item.session_id,
          gameid: gameid
        }))
      })
      // store game data and increment game id
      games.set(gameid.toString(), {
        "players": gameData,
        "sockets": new Map(),
        "score": 0,
        "minus": null,
        "plus": null
      })
      gameid++
    }
    socket.on('disconnect', () => {
      console.log("a user disconnected")
      queue.dequeue(userData)
      console.log("queue.length: " + queue.length)
    })
  })
  _ingame.on('connection', (socket) => {
    if (games.size == 0) {
      gameDNE(socket, "This game does not exist!")
      return
    }
    let gameid = socket.request._query.gameId
    // TODO: REPLACE THIS WITH USER AUTH
    let user = socket.request._query.uid
    let gamedata = games.get(gameid)
    let allowed_users = gamedata.players
    if (!gamedata) {
      gameDNE(socket, "This game does not exist!")
      return
    }
    // kill anyone who is trying to join and not allowed
    // if (allowed_users.has(req.cookies["connect.sid"])) {
    // is a TODO
    if (true) {
      gamedata.sockets.set(user, socket)
      let id_player;
      if (socket.request.session.user) {
        id_player = socket.request.session.user;
      }
      else {
        id_player = socket.request.session.id;
      }

      if (gamedata.minus == null) {
        gamedata.minus = socket.request._query.uid
      }
      else if (gamedata.plus == null) {
        gamedata.plus = socket.request._query.uid
      }
    } else {
      // kick from game
      gameDNE(socket, "You are not a player in this game!!")
      return
    }

    if (gamedata.sockets.size == 2) {
      let gameInfo = {
        "score": gamedata.score
      };
      for (let i = 0; i < 2; i++) {
        let uid = gamedata.players[i].user
        let s = gamedata.sockets.get(uid)
        let isPlus = gamedata.minus != s.request._query.uid
        if (isPlus) {
          gameInfo["right"] = gamedata.players[i].screenName
          gameInfo["rightuid"] = gamedata.players[i].user
        } else {
          gameInfo["left"] = gamedata.players[i].screenName
          gameInfo["leftuid"] = gamedata.players[i].user
        }
      }
      for (let i = 0; i < 2; i++) {
        let uid = gamedata.players[i].user
        let s = gamedata.sockets.get(uid)
        gameInfo["minus"] = gameInfo.leftuid == s.request._query.uid
        s.emit("roles", JSON.stringify(gameInfo))
      }
    }

    socket.on("move", (msg) => {
      if (!gamedata) {
        return
      }
      if (gamedata.sockets.size == 2 && (gamedata.score < 19 && gamedata.score > -19)) {
        // do a play of the game...
        if (gamedata.minus == user) {
          gamedata.score = gamedata.score - 1
        } else {
          gamedata.score = gamedata.score + 1
        }
        let msg = {
          value: gamedata.score
        }
        gamedata.sockets.forEach(item => {
          item.broadcast.emit("play", JSON.stringify(msg))
        });
      } else {
        // the game is over if we get here.
        let winner = gamedata.score < 0 ? gamedata.minus : gamedata.plus;
        let playersReport = {};
        let playersScreen = {};
        gamedata.players.forEach(function (currentPlayer) {
          playersReport[currentPlayer.user] = currentPlayer.connected
          playersScreen[currentPlayer.user] = currentPlayer.screenName
        })
        if (playersReport[winner]) {
          fetch("https://info-441-final.vercel.app/api/registerWin?uid=" + winner)
            .catch(function (error) {
              console.log(error);
            })
        }
        let winnerBlurb = playersScreen[winner] + " wins"
        let msg = {
          type: "gameover",
          winner: winnerBlurb
        }
        gamedata.sockets.forEach(item => {
          item.broadcast.emit("gameover", JSON.stringify(msg))
        });
        // destroy game and disconnect websockets
        games.delete(gameid)
        gamedata.sockets.forEach(item => {
          item.disconnect(0)
        })
      }
    })
  })
  return router
}

export default createRouter;
