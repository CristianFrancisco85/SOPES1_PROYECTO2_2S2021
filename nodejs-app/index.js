var express = require('express')
var cors = require('cors')
var app = express()
var port = process.env.PORT || 4000;
var server = require('http').createServer(app)

//Connection to mongodb
const { MongoClient } = require("mongodb")
const uri ='mongodb://DummyAdmin:password85@104.197.101.28:27017/?authSource=admin'
const client = new MongoClient(uri)
//Connection to Redis
const redis = require('redis')
const clientRedis = redis.createClient(6379, '35.225.83.23',{password: 'password85@'})

//Socket.io
const io = require("socket.io")(server,{
    cors: {
        origin: "*",
    }
})
let interval
//Create the socket
io.on('connection', function(socket) {
    console.log('user connected');

    //Send the message to the client
    socket.emit('message', 'Welcome to the chat app')

    if(interval) {
        clearInterval(interval)
    }

    interval = setInterval(() => {

        client.connect(err => {
            const collection = client.db("squidgame").collection("winners")
            collection.find({}).toArray((err, result) => {
                if (err) throw err;
                socket.emit('mongodbData', result);
            })
        })

        client.connect(err => {
            const collection = client.db("squidgame").collection("logs")
            collection.find({}).toArray((err, result) => {
                if (err) throw err
                socket.emit('logs', result)
            })
        })

        clientRedis.zrevrangebyscore("playersSort", "+inf", "-inf", "WITHSCORES", "LIMIT", 0, 10, (err, result) => {
            if (err) throw err
            socket.emit('topPlayers', result)
        })
        clientRedis.zrevrangebyscore("gamesSort", "+inf", "-inf", "WITHSCORES", "LIMIT", 0, 10, (err, result) => {
            if (err) throw err
            socket.emit('topGames', result)
        })
        clientRedis.zrevrangebyscore("workersSort", "+inf", "-inf", "WITHSCORES", "LIMIT", 0, 10, (err, result) => {
            if (err) throw err
            socket.emit('workers', result)
        })
        clientRedis.lrange("gamesList", 0, 10, (err, result) => {
            if (err) throw err
            socket.emit('games', result)
        })


    }, 5000);

    socket.on('disconnect', function() {
        console.log('user disconnected')
    });
});

//Start the server
server.listen(port, function() {
    console.log('Server started on port ' + port)
});

