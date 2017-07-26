// server init
const express = require('express'),
      app     = express(),
      server  = require('http').createServer(app),
      io      = require('socket.io').listen(server);
      
server.listen(8080);
//tell the server that ./public/ contains the static webpages
app.use(express.static('public'));
      
// example how to scan & parse Estimote Nearable packets with noble
var noble = require('noble');
var estimoteNearable = require('./estimote-nearable');

noble.on('stateChange', function(state) {
  console.log('state has changed', state);
  if (state == 'poweredOn') {
    var allowDuplicates = true;
    noble.startScanning([], allowDuplicates, function(error) {
      if (error) {
        console.log('error starting scanning', error);
      } else {
        console.log('started scanning');
      }
    });
  }
});
  
//send motiondata reading out to connected clients
//w/ sockets
io.sockets.on('connection', socket => {
  console.log('connection user');

  noble.on('discover', function(peripheral) {
    var data = peripheral.advertisement.manufacturerData;
    if (!data) { return; }

    var nearablePacket = estimoteNearable.packet(data);
    if (nearablePacket) {
      // 1 estimote stickers == 1916ebf05bf2c13f
      if(nearablePacket.nearableId == '1916ebf05bf2c13f' || nearablePacket.nearableId == '70d4d79ad2f3cd43'){
        console.log(nearablePacket);
        socket.emit('isMoving', {nearablePacket});
      }
    }
  });

});