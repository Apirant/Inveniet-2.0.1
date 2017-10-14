var mongoose = require("mongoose");

// Modelo Puntuacion

var Schema   = mongoose.Schema;

	var PuntuacionModelo = new Schema({
		ID_usuario: 	{ type: String },
		puntos: 		{ type: Number },
		ID_Local:		{ type: String }
	});

var puntuacion = mongoose.model('Reputacion', PuntuacionModelo);

module.exports =puntuacion;