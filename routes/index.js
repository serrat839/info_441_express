import { enable } from 'debug';
import express from 'express';
import fetch from "node-fetch";

var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.testVar = "ThisRocks";
  let PORT = process.env.PORT
  res.render('index', { title: 'Express', testVar : "ThisRocks" });
});

router.get('/portNUM', function(req, res, next) {
  res.type('json')
  console.log("port")
  console.log(req.app.get('port'))
  res.send(JSON.stringify({port: req.app.get('port')}));
});

router.get('/playingAs', async function(req, res, next) {

  let myJson;
  if(req.query.user)
  {
    req.session.user = req.query.user
    try{
      let fetchResult = await fetch("https://www.clowntown.me/api/getsonanumber?uid=" + req.query.user);
      myJson = await fetchResult.json();
      req.session.screenName = myJson.email;
      req.session.user = req.query.user
      req.session.sonanumber = myJson.number;
    }catch(error){console.log(error)}
  }
  res.type('json')
  if(req.query.chat){
    res.redirect("/chat");
  } else if (req.query.metadata) {
    res.send(JSON.stringify(myJson))
  }
  else{
    res.redirect("/");
  }

});

router.get('/getRanked', function(req, res, next) {
  res.type('json')
  res.send(JSON.stringify({user: req.session.user, screenName: req.session.screenName}));
});


export default router;
