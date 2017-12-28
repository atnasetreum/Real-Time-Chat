var $port          = 8080;
var ListCometarios = [];
var express        = require('express');
var app            = express();
var server         = require('http').Server(app);
var io             = require('socket.io')(server);
var mysql          = require('mysql'); //, async = require('async');
var axios         = require('axios');


app.use(express.static('public'));
var $url_coment = "http://localhost:8000/api/v1/chatComment";




/*app.get($url_coment, function (req, res) {
//    res.status(200).send('hello word');
console.log(res);
});*/

var DB = mysql.createConnection({
  host    : 'localhost',
  user    : 'root',
  password: '',
  database: 'sku_online_05122017'
});

DB.connect(function(err) { if (err) throw err; console.log('Conectado a la DB.'); });


var callComent = (socket, actualizar_nodos) => {
    /*DB.query('SELECT * FROM comentarios', (err, results) => {
        if (err) throw err;
        ListCometarios = results;
        //if(actualizar_nodos != undefined){
            io.sockets.emit('mensaje', ListCometarios);
        //}else{
            //socket.emit('mensaje', ListCometarios);
        //}
    });*/
    axios.get($url_coment)
      .then(function (response) {
        ListCometarios = response.data;
        io.sockets.emit('mensaje', ListCometarios);

        /*console.log(obj);
        for (var i = 0, tamanio = obj.length; i < tamanio; i++) {
            //Things[i]
        }*/
    })
    .catch(function (error) {
        console.log(error);
    });
};



io.on('connection', function(socket) {

    console.log('Cliente conectado a travez de socket');

    callComent(socket);

    socket.on('nuevos-mensajes', function (data) {
        console.log('nuevomensaje: '+data.texto);
        axios.post($url_coment, {
            comment: data.texto
          })
          .then(function (response) {
            callComent(socket);
            console.log(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
        /*DB.query('INSERT INTO comentarios (texto) VALUES (?)', [data.texto], (err, result) => {
            if (err) throw err;
            console.log('Se inserto un registro: '+result.insertId);
            callComent(socket);
        });*/
    });


});

server.listen($port, function () {
    console.log('Server http://localhost:'+$port);
});