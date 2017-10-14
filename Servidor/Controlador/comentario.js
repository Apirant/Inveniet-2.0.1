var comentario = require('../../Servidor/Modelos/m-comentario');

module.exports.AgregarComentario = function(req,res)
{

	try 
		{
		
		var nuevo= {
			ID_usuario: req.idU,
			nombre_usuario: req.NU,
			mensaje: req.texto,
			fecha: new Date().getTime(),
			Id_local: req.idl

				}

		var comt = new comentario(nuevo);

		console.log("\n Voy a guardar comt: \n"+comt+"\n")

		comt.save(function(err,comt){
			if(err) return console.log(err);
			else {
				return console.log(comt);
			}
		});


						} 
	catch(e) 
		{
		
			console.log(String(e));
						}

					};
