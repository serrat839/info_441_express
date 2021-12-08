import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
// import gamingRouter from './routes/gaming.js';


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();
const PORT = process.env.PORT || 3000;
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// const oneDay = 1000 * 60 * 60 * 24
// app.use(session({
//   secret: "Thisisashitsecretlmfaoasdf;lkasdf;",
//   saveUninitialized: true,
//   cookie: {maxAge: oneDay},
//   resave: false

// }))
/*
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Example app listening at http://localhost:PORT')
})
*/
export default app;
