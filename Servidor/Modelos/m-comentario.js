var mongoose = require("mongoose");

// Modelo Comentario

var Schema   = mongoose.Schema;

	var ComentarioModelo = new Schema({
		ID_usuario: 	{ type: String },
		nombre_usuario:  { type: String },
		mensaje: 		{ type: String },
		fecha: 			{ type: Date },
		Id_local:	{ type: String }
	});

var comentario = mongoose.model('Comentario', ComentarioModelo);

module.exports = comentario;