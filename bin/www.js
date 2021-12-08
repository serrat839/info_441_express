#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app.js';
import debugLib from 'debug';
import http from 'http';
import session from 'express-session';

import indexRouter from '../routes/index.js';
import usersRouter from '../routes/users.js';
import gamingRouter from '../routes/gaming.js';
import chatRouter from '../routes/chat.js';

import { Server } from "socket.io";

const debug = debugLib('express-starter:server');
const oneDay = 1000 * 60 * 60 * 24
const sessionMiddleware = session({
  secret: "Thisisashitsecretlmfaoasdf;lkasdf;",
  saveUninitialized: true,
  cookie: {maxAge: oneDay},
  resave: false

})
app.use(sessionMiddleware)
/**
* Get port from environment and store in Express.
*/

var port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

/**
* Create HTTP server.
*/

var server = http.createServer(app);
const io = new Server(server)
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next)
})

app.set('socketio', io)
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/gaming', gamingRouter(io, sessionMiddleware));
app.use('/chat', chatRouter(io, sessionMiddleware));


/**
* Listen on provided port, on all network interfaces.
*/

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
* Normalize a port into a number, string, or false.
*/

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
* Event listener for HTTP server "error" event.
*/

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
* Event listener for HTTP server "listening" event.
*/

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}