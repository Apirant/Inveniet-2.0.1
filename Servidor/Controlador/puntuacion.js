var puntuacion = require('../../Servidor/Modelos/m-puntuacion');

module.exports.AgregarPuntuacion = function(req,res)
{

	try 
		{
		
		var nuevo= {
			ID_usuario: 	req.idU,
			puntos: 		req.estrellas,
			id_local: 		req.idl

				}
		var puntuar = new puntuacion(nuevo);

		puntuar.save(function(err,puntuar){
			if(err) return console.log(err);
			else {
				return console.log(puntuar);
			}
		});
						} 
	catch(e) 
		{
		
			console.log(String(e));
						}

					};

