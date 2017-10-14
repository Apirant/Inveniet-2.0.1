var mongoose = require("mongoose");


var Schema   = mongoose.Schema;

	var LocalModelo = new Schema({
		nombre: 		{ type: String },
		Rif: 			{ type: String },
		compania: 		{ type: String },
		tipo: 			{ type: String },
		contrasena: 	{ type: String },
		reputacion: 	{ type: Number },
		correo:  		{ type: String },
		img: 			{ type: String },
		
		informacionContacto:{
			direccion: 	{ 
				pais: 	{ type: String },
				estado: { type: String },
				municipio: { type: String },
				calle: { type: String },
			 },
			numero: { type: Number }

		}
	});

var locales = mongoose.model('Local', LocalModelo);

module.exports = locales;