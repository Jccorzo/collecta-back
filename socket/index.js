const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
var bodyParser = require('body-parser');

app.use(bodyParser.json());

server.listen(3000);

app.post('/login', (req, res) => {
    let userInfo = getClientByEmail(req.body.email) !== undefined ? getClientByEmail(req.body.email) : getAssociationByEmail(req.body.email);
  res.send(JSON.stringify(userInfo))
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

  socket.on('shoping', (order) => {
      console.log(associations);
      console.log(io.sockets.connected);
      io.sockets.connected[associations[0].socketId.split("#")[1]].emit('newOrder',order);
    socket.emit('newOrder',order);
  });
  

  socket.on('newOrder',(order)=>{
      console.log(order);
  })

  socket.on('acceptedOrders', (data) => {
    console.log(data);
  });

  socket.on('disconnect', (data) => {
    let getBuyer = getItemInArrayBySocketId(buyers,socket.id);
    let getAssociation = getItemInArrayBySocketId(associations,socket.id);
    getBuyer !== undefined ? buyers = deleteItemInArrayBySocketId(buyers,getBuyer): associations = deleteItemInArrayBySocketId(associations,getAssociation);
  });

});


const deleteItemInArrayBySocketId = (array,item) =>{
   return array.filter((value)=>{
        return value.socketId !== item.socketId
    });
}

const getItemInArrayBySocketId = (array,socketId) =>{
    return array.filter((value)=>{
         return value.socketId == socketId
     })[0];
 }

 const getClientByEmail = (email) =>{
    return clientsDb.filter((value)=>{
         return value.email == email
     })[0];
 }

 const getAssociationByEmail = (email) =>{
    return associationsDb.filter((value)=>{
         return value.email == email
     })[0];
 }


var associationsDb = [
    {
        "id": "1",
        "name": "UMATA Sopetran",
        "address": "Calle 3 #5",
        "region": "Antioquia",
        "state": "Occidente Antioqueno",
        "city": "Sopetran",
        "email": "UMATAsopetran@association.gov.co",
        "products": [
            "1",
            "2",
            "3"
        ],
        "rol":"associate"
    },
    {
        "id": "2",
        "name": "UMATA Guatape",
        "address": "Calle 29 #55a",
        "region": "Antioquia",
        "state": "Oriente Antioqueno",
        "city": "Guatape",
        "email": "UMATAguatape@association.gov.co",
        "products": [
            "1"
        ],
        "rol":"associate"
    },
    {
        "id": "3",
        "name": "UMATA Copacabana",
        "address": "Calle 50 #32a",
        "region": "Antioquia",
        "state": "Antioquia",
        "city": "Copacabana",
        "email": "UMATAcopacabana@association.gov.co",
        "products": [
            "2"
        ],
        "rol":"associate"
    }
];

var productsDb = [
    {
      "id": "1",
      "name": "Mango tommy",
      "price": 5000,
      "unit": "Kilogramo",
      "url": "require('../../assets/images/Mango.png')",
      "urlGrande": "require('../../assets/images/Mango_grande2x.png')",
      "info": "Nuevo producto",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris irure dolor in reprehenderit in voluptate velit esse"
    },
    {
        "id": "2",
        "name": "Mora",
        "price": 3500,
        "unit": "Kilogramo",
        "url": "require('../../assets/images/Mora.png')",
        "urlGrande": "require('../../assets/images/Mora_grande2x.png')",
        "info": "Nuevo producto",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris irure dolor in reprehenderit in voluptate velit esse"
      },
      {
        "id": "3",
        "name": "Manzana",
        "price": 5000,
        "unit": "Kilogramo",
        "url": "require('../../assets/images/Manzana.png')",
        "urlGrande": "require('../../assets/images/Manzana_grande2x.png')",
        "info": "Nuevo producto",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris irure dolor in reprehenderit in voluptate velit esse"
      }
]

var clientsDb = [
    {
        id: "2323",
        idType: "cedula",
        name: "Juan Camilo",
        lastName: "Corzo",
        email: "ccorzo26@gmail.com",
        phone: "312345",
        city: "Medellin",
        rol:"buyer"
    },
    {
        "id": "46890",
        "idType": "cedula",
        "name": "Daniel Steveen",
        "lastName": "Ocampo",
        "email": "ocampo@gmail.com",
        "phone": "456435436",
        "city": "Medellin",
        "rol":"buyer"
    }
    ,
    {
        "id": "134675",
        "idType": "cedula",
        "name": "Nicolas",
        "lastName": "Ortiz",
        "email": "nico@gmail.com",
        "phone": "1232134",
        "city": "Cali",
        "rol":"buyer"
    }

]