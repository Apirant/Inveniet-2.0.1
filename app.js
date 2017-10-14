var express = require('express');
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var multer = require("multer");

mongoose.Promise = require('bluebird');
var servidor = express();
var mul = multer({ dest: 'Cliente/iproductos/' });

servidor.use(bodyParser.urlencoded({ extended: true }));
servidor.use(bodyParser.json({type: 'aplication/*+json' }));


//servidor.use(methodOverride());

servidor.use(express.static("Cliente"));
servidor.set("view engine","jade");


mongoose.connect('mongodb://localhost/inveniet', function(err, res) {  
  if(err) {
    console.log('ERROR: Conexion a Database. ' + err);
  }
  else{
  	console.log('Conectado a base de datos inveniet');
  }
});


servidor.get("/",function(solicitud,respuesta){

	respuesta.render("index");

});

servidor.listen(5000, function(){
	 console.log("Servidor de NodeJs corriendo en http://localhost:5000");
});
