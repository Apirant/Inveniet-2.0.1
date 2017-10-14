
var mongoose = require("mongoose");


var Schema   = mongoose.Schema;

	var ProductoModelo = new Schema({
		nombre: 		{ type: String },
		empresa: 		{ type: String },
		id_local: 		{ type: String },
		tipo: 			{ type: String },
		descripcion: 	{ type: String },
		precio: 		{ type: Number },
		img: 			{ type: String }
		
	});

var productos = mongoose.model('Producto', ProductoModelo);

module.exports = productos;