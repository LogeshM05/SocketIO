// const app = require('express')();
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);
// const port = process.env.PORT || 3000;
// app.get('/', function(req, res) {
//   res.send("Socket is connected successfully")
// });

// app.get('/api', function(req, res) {
//   res.json({status: 200, message: "Success"})
// });

// io.on('connection', (socket) => {
//   console.log("mobile socket is connected");
//   socket.emit('connect', {message: 'a new client connected'})
// })

// server.listen(port, "172.31.3.47", function() {
//   console.log(`Listening on port ${port}`);
// });

// import express from "express";
// import { createServer } from "http";
// import { Server } from "socket.io";

// const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer, {});

// io.on("connection", (socket) => {
//   console.log("Socket is connected: ", socket.id);
// });

// httpServer.listen(3000, () => {
//   console.log("Server is up and running in port: 3000");
// });



const tls = require("tls");
const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);

//const io = require('socket.io')(server);

const io = require("socket.io")(server, {
  //path: '/test',
  // serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,clearImmediate
});
const port = process.env.PORT || 3000;
// const hostname = '10.200.1.50';
const hostname = "s1-dtlk.onrender.com";
tls.DEFAULT_MAX_VERSION = "TLSv1.3";
//server.listen(port, () => {
server.listen(port () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
var allUsers = new Map();
app.use(function (req, res, next) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept-Type"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.writeHead(200, { "Content-Type": "text/plain" });
    // res.setHeader('Content-Type', 'text/html');
    // res.setHeader('Content-Length', Buffer.byteLength(content));
    console.log("Socket.IO Connected Successfully3");
    res.end("Socket.IO Connected Successfully3");
    next();
  } catch (e) {
    consolelog("Http Error request" + e);
  }
});

app.get('/api', function(req, res) {
  res.json({status: 200, message: "Success"})
});

io.sockets.on("connection", function (socket) {

  consolelog("**** \n Socket is connected");
  
  socket.on("livedashboard", function (user) {
    try {
      // livedashboared liseners join the domain name group
      socket.join(user.appId);
      /**********************/
      var topic = user.appId + "clients";
      //  consolelog("Emit request Topic Name : " + topic);
      socket.to(topic).emit(topic, "Hi");
    } catch (e) {
      consolelog(e);
    }
  });

  socket.on("NewAppUser", function (user) {

    console.log("new user connected: " );

    try {
      // web site users join the (domain name + clients) group
      var topic = user.appId + "clients";
      socket.join(topic);
      /**********************/
      allUsers.set(socket.id, user.appId);
      //consolelog('total Audience' + allUsers.size);
      user.socketId = socket.id;

      // sending the message to livedashboard users & under the topic of domainName
      console.log("new user connected: " + user.appId);
      socket.to(user.appId).emit(user.appId, user);
    } catch (e) {
      consolelog(e);
    }
  });

  socket.on("campaignBlast", function (user) {
    try {
      user.socketId = socket.id;
      var groupName = user.appId + "clients";
      var topicName = user.appId + "newCampaigns";
      socket.to(groupName).emit(topicName, user);
    } catch (e) {
      consolelog(e);
    }
  });

  socket.on("disconnect", function () {
    try {
      var appId = allUsers.get(socket.id);
      consolelog("User DisConnected" + appId);
      allUsers.delete(socket.id);
      socket.to(appId).emit("UserDisconnected", socket.id);
    } catch (e) {
      consolelog("error :" + e);
    }
  });
});

function consolelog(message) {
  console.log(getDateTime() + ": " + message);
}

// function logs message to the log file
function logMessage(message) {
  fs.appendFile("log.txt", getDateTime(), "utf8", function (err) {});
  fs.appendFile("log.txt", "\n", "utf8", function (err) {});
  fs.appendFile("log.txt", message, "utf8", function (err) {});
  fs.appendFile("log.txt", "\n", "utf8", function (err) {});
}

// get the date time
function getDateTime() {
  var currentdate = new Date();
  var datetime =
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    " @ " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();

  return datetime;
}
