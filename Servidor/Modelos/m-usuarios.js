
var mongoose = require("mongoose");

var Schema   = mongoose.Schema;

	var UsuarioModelo = new Schema({
		nombre: 		{ type: String },
		apellido: 		{ type: String },
		correo: 		{ type: String },
		nombreUsuario: 	{ type: String },
		contrasena:  	{ type: String },
		img: 			{ type: String }
	});

var usuarios = mongoose.model('Usuario', UsuarioModelo);

module.exports = usuarios;
