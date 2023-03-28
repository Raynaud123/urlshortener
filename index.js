require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('node:dns');

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let index = 0;
let dictionary = {};

app.post("/api/shorturl",function(req,res,next){
  req.test = req.body["url"];
  next();
},function(req,res, next){
  const REPLACE_REGEX = /^https?:\/\//i
  let res1 = req.test.replace(REPLACE_REGEX, '');
  res1 = res1.substring(0, res1.lastIndexOf('/'));
  dns.lookup(res1,function(error,address, family){
    if (error) {
      res.json({error: 'invalid url'});}
    else{
      index++;
      dictionary[index] = req.test;
  res.json({"original_url":req.test,"short_url":index})
    }
  })
});

app.get("/api/shorturl/:short",function(req,res,next){
  req.shortUrl = req.params.short;
  next();
},function(req,res,next){
  if(req.shortUrl in dictionary){
    res.redirect(dictionary[req.shortUrl])
  }else{
     res.send("ShortUrl doesn't exist") 
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
