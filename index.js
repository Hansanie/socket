// var socket = require('socket.io'), http = require('http'),

// server = http.createServer(), socket = socket.listen(server);

// socket.on('connection', function(connection) {

// console.log('User Connected');

// connection.on('message', function(msg){

// socket.emit('message', msg);

// });

// socket.on('add-message', (message) => {

// io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});

// });

// socket.on('disconnect', function(){

// io.emit('users-changed', {user: socket.nickname, event: 'left'});

// console.log('User Disconnected');

// });

// });

// server.listen(3000, function(){

// console.log('Server started');

// });

var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var mongoose = require('mongoose');
var mysql = require('mysql');
var cors = require('cors');

app.use(cors());
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// var Message = mongoose.model('Message',{
//   name : String,
//   message : String
// })

// var Message = mysql.createPool('Message', {
//   name: String,
//   message : String
// })
// var dbUrl = 'mongodb://sandunika:Sandu9503@ds351628.mlab.com:51628/messages'

var mysql1 = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test',
})

// app.get('/messages', (req, res) => {
//   Message.find({
//       message:"online"
//   },(err, messages)=> {
//     res.send(messages);
//   })
// })


io.on('connection', () =>{
  console.log('a user is connected')
})

// mongoose.connect(dbUrl ,{useMongoClient : true} ,(err, db) => {
//   console.log('mongodb connected',err);
// })

mysql1.connect((err)=>{
  if(!err){
    console.log('success');
  } else {
    console.log('error');
  }
})

var server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});
io.on('connection', (socket) => {
app.get('/message', function(req,res,next){
  mysql1.query('SELECT * from message', function(error, results, fields){
    if(error) console.log(error);
    // console.log(results);
    res.send(results);
  })
})
app.post('/message',(req,res,next)=>{
  var sql = "INSERT INTO message (id, message, user_id) VALUES (NULL, '" + req.body.message + "', '" + req.body.userId + "')";
  mysql1.query(sql, (error, results, fields)=>{
    if(error) console.log(error);
    io.emit('message', req.body);
    res.sendStatus(200);
  })
})
});io.on('connection', (socket) => {
  app.get('/respond', function(req,res,next){
    mysql1.query('SELECT * from message', function(error, results, fields){
      if(error) console.log(error);
      console.log(results);
      res.send(results);
    })
  })
  app.post('/respond',(req,res,next)=>{
    let id = req.body.id;
    let respond = req.body.respond;
    console.log(id);
    // var sql = 'UPDATE message SET respond = ? WHERE id = ?', ['"+req.body.respond, id]
    // var sql = 'UPDATE message SET respond WHERE id = id';
    // var sql =  ('UPDATE message SET ? WHERE id = ?', [{ respond: respond }, id]);
    console.log(sql);
    mysql1.query('UPDATE message SET ? WHERE id = ?', [{ respond: respond }, id], (error, results, fields)=>{
      console.log(results)
      if(error) console.log(error);
      io.emit('respond', req.body);
      res.sendStatus(200);
    })
  })
  });


// app.get('/messages', (req, res) => {
//   Message.find({},(err, messages)=> {
//     res.send(messages);
//   })
// })

// app.post('/messages', (req, res) => {
//   var message = new Message(req.body);
//   message.save((err) =>{
//     if(err)
//       sendStatus(500);
//     io.emit('message', req.body);
//     res.sendStatus(200);
//   })
// })
