const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(3000);
// WARNING: app.listen(80) will NOT work here!

app.get('/', (req, res) => {
  res.send('ready')
});

// temporal de compradores, y temporal de cooperativas, temporal de pedidos
var buyers = [];
var associations = [];
var orders = [];

const socketNsp = io.of('/socket');

socketNsp.on('connection', (socket) => {

    console.log(socket.id,'conectadi')

  socket.on('login', (data) => {
      let socketId = socket.id;
        let tmpObject = {...data,socketId}
      if(data.rol=='buyer'){
        buyers.push(tmpObject)
      } else {
        associations.push(tmpObject)
      }

  })

  socket.on('shoping', (data) => {
    console.log(data)
  });
  
  socket.on('acceptedOrders', (data) => {
    console.log(data);
  });

  socket.on('disconnect', (data) => {
    
    console.log(data);
  });

});

//canal para escuchar inicio de sesion (login)
//canal para escuchar compras (shoping)
//canal para escuchar pedidos aceptados(acceptedOrders)
