var express = require('express');
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var multer = require("multer");
var cookieSession = require("cookie-session");

mongoose.Promise = require('bluebird');
var servidor = express();
var mul = multer({ dest: 'Cliente/iproductos/' });
var mulu = multer({ dest: 'Cliente/iusuarios/' });



servidor.use(bodyParser.urlencoded({ extended: true }));
servidor.use(bodyParser.json({type: 'aplication/*+json' }));

//Configuracion de la session
servidor.use(cookieSession({
	name: "session",
	keys: ["llave-1", "llave-2"]

}));


var usuario = {
	id: {type: String},
	nombre: {type: String},
	cuenta: {type: String}
}
usuario.logeado=false;
usuario.tipo=false;





//Base de datos:

mongoose.connect('mongodb://localhost/inveniet', 

	function(err, res) {  
  
		  if(err) { console.log('ERROR: Conexion a Database. ' + err); }
		  
		  else{
		  		console.log('Conectado a base de datos inveniet');
						  }

											}
	);


//Modelos (Tablas):

	var user  = require('./Servidor/Modelos/m-usuarios');
	var local =  require('./Servidor/Modelos/m-locales');
	var producto   =  require('./Servidor/Modelos/m-productos');
	var comentario =  require('./Servidor/Modelos/m-comentario');
	var puntuacion =  require('./Servidor/Modelos/m-puntuacion');

//Controladores:

	var cUsuario = require('./Servidor/Controlador/usuarios');
	var cLocal = require('./Servidor/Controlador/locales');
	var cProducto = require('./Servidor/Controlador/productos');
	var cPuntuacion = require('./Servidor/Controlador/puntuacion');
	var cComentario = require('./Servidor/Controlador/comentario');


//Vistas con Jade
	servidor.use(express.static("Cliente"));
	servidor.set("view engine","jade");



//Rutas:
	
	//Pag principal
	
		servidor.get("/",function(solicitud,respuesta){

		respuesta.render("index",{Usuario: usuario});
	

					});

	//Salir de la session
	
		servidor.post("/",function(solicitud,respuesta){

			usuario.logeado=false;
			usuario.tipo=false;

			console.log("te muestro el mio: ");
			console.log(usuario);

			respuesta.render("index",{Usuario: usuario});

				});


	//Registrar Usuarios

		servidor.post("/regu",function(solicitud, respuesta){
			
			cUsuario.registrarUsuario(solicitud);

			respuesta.render("index",{Usuario: usuario});
		});


	//Registrar Locales

		servidor.post("/regl",function(solicitud, respuesta){

			cLocal.registrarLocal(solicitud);

			respuesta.render("index",{Usuario: usuario});
		});


	//Cargar Productos
		servidor.post("/cargp", mul.single('imag_producto'),function(solicitud, respuesta){

			cProducto.cargarProducto(solicitud, respuesta, usuario);

			respuesta.render("index",{Usuario: usuario});
		});


	//Mostrar Productos en el buscador

		servidor.get("/busp", function(solicitud, respuesta){

			console.log(solicitud.query);

			cProducto.BuscarProductos(solicitud, respuesta, usuario, solicitud.query.texto);

			});



servidor.post("/cuenta", mulu.single('img'), function(solicitud, resp){
	console.log(solicitud.body);

	switch (solicitud.body.action) {

		case 'logeo':

			switch (solicitud.body.cuenta) 
				{
					case 'usuario':
						console.log("\n Entre por Usuario \n");

						cUsuario.Logear(solicitud, resp, usuario);

						break;


					case 'tienda':
						
						console.log("\n Entre por Tienda \n");
						cLocal.Logear(solicitud, resp, usuario);
						
						break;

					default:
						// statements_def
						break;
					}
			
			break;
		
		case 'ver_perfil':
			console.log("\nEntre por perfil\n");
			
			switch (solicitud.body.cuenta)
				{
					case 'Usuario':
						console.log("\nEntre por Usuario\n");
						cUsuario.BuscarUsuario(solicitud.body, resp, usuario);
						break;


					case 'Tienda':
						console.log("\nEntre por Tienda\n");
						cLocal.BuscarLocal(solicitud.body, resp, usuario);

						break;
						}

			break;

		case 'eliminar':

			try 
				{
					console.log("\n Voy a Eliminar lo siguiente: \n");
					console.log(solicitud.body);

					cLocal.EliminarP(solicitud.body, resp, usuario);
					cLocal.BuscarLocal(usuario, resp, usuario);

								}
			catch(e) 
				{
					console.log(String(e));
								}
			break;

		default:

			switch (solicitud.body.cuenta) 
				{
					case 'usuario':
						console.log("\n Entre por Usuario \n");

						cUsuario.Editar(solicitud, resp, usuario);

						break;


					case 'tienda':
						
						console.log("\n Entre por Tienda \n");
						cLocal.Editar(solicitud, resp, usuario);
						
						break;

					default:
						// statements_def
						break;
					}
			break;
		}

	});


servidor.post("/producto", function(solicitud, resp){

	console.log(solicitud.body);

	if(solicitud.body.cmt){

		cComentario.AgregarComentario(solicitud.body); 

	}

	else{
		
	
		cPuntuacion.AgregarPuntuacion(solicitud.body);

	}

									
resp.redirect("/producto?id="+solicitud.body.pid);

});




// Lanzador de pagina de SERVICIO

servidor.get("/servicio",function(solicitud,respuesta){

	respuesta.render("fstec");
});






// Lanzador de pagina ficha de producto
servidor.get("/producto", function(solicitud,respuesta){
	console.log(solicitud.query.id);

	var dp , dl;

	var nuevo = {
					ID_usuario: 	{ type: String },
		nombre_usuario:  { type: String },
		mensaje: 		{ type: String },
		fecha: 			{ type: Date },
		Id_local:	{ type: String }
			
			};

	var n=[];

	producto.find({_id: solicitud.query.id}, function(err, documentos){

		console.log(documentos.length);

		if(err) console.log(err);

		else{
			console.log(documentos[0]);
			dp = documentos[0];

			console.log('Este es el id del local: '+dp.id_local);

			local.find({_id: dp.id_local}, function(err, registro){
				console.log(registro.length);

				if(err) console.log(String(err));

				else{
					//console.log(registro[0]);
					dl = registro[0];


					comentario.find({Id_local: dl.id}, function(err,coment){
							if(err) console.log(String(err));
							else
							{

								var minute = 1000 * 60;
								var hour = minute * 60;
								var day = hour * 24;

								nuevo=coment;

								for(var i=0; i<coment.length;i++){
									console.log(" length vale: "+coment.length+"\n");
						
									

									console.log("\n Esto es n cuando i vale: ");
									console.log(nuevo);

									


								}
								console.log("\n Vengo a  mostrar q tiene n antes de salir del ciclo: \n");
									console.log("\n Esto es los dos comentrios de n: \n");
									console.log(nuevo);

									respuesta.render("producto2", {Usuario: usuario, dp: dp, dl: dl, coments: nuevo});
								
								//console.log(comt);
							}
						});

				} 

					
				
				});

		} 

		});

});



// Lanzador de pagina de carga de productos

servidor.get("/cargp",function(solicitud,respuesta){

	respuesta.render("cargp", {Usuario: usuario});
});


// Lanzador de pagina de registro de usuarios

servidor.get("/regu",function(solicitud,respuesta){

	respuesta.render("regu",{Usuario: usuario});
});

// Lanzador de pagina de registro de locales

servidor.get("/regl",function(solicitud,respuesta){

	respuesta.render("regl",{Usuario: usuario});
});








// Lanzador perfil del Local
servidor.get("/Local",function(solicitud,respuesta){

	respuesta.render("Local");
});




// Modelo Servicio
var Schema = mongoose.Schema;

	var ServicioModelo = new Schema({
		
		Datos_Aula: {
			ND: { type: String},
			NA: { type: String},
			INS: { type: String},
			G: 	 { type: Number },
			SEC: { type: String},
			TIN: { type: String}
		},

		Datos_Comp: {
			PC: { type: String},
			MOD: { type: String},
			SER: { type: String},
			SO: { type: String},
			VSO: { type: String},
			NUSB: { type: String},
			NR: { type: String},
			NAUD: { type: String},
			TPV: { type: String}
		},

		Condiciones_PC: {
			CG: { type: String},
			NAS: { type: String},
			TECL: { type: String},
			M: { type: String},
			PANT: { type: String},
			BATT: { type: String},
			CAM: { type: String},
			COR: { type: String},
			EUSB: { type: String},
			USBO: { type: String},
			EPV: { type: String},
			ER: { type: String},
			EWF: { type: String},
			PCR: { type: String},
			HOT: { type: String},
			CULER: { type: String},
			DISR: { type: String},
			NMD: { type: Number },
			UMD: { type: String},
			TD: { type: Number },
			UTD: { type: String },
			CC: { type: String},
			OFF: { type: String},
			GAME: { type: String}
		}

	});

var servicio = mongoose.model('Servicio', ServicioModelo);


// Controlador Servicio
servidor.post("/fstec",function(solicitud, respuesta){
	console.log("\n este es el que recibi por post servicio: \n");
	console.log(solicitud.body);
	console.log("\n Esto es lo que guarde: \n");

	var nuevo = {

			Datos_Aula: {
				ND: solicitud.body.ND,
				NA: solicitud.body.NA,
				INS: solicitud.body.INS,
				G:   solicitud.body.G,
				SEC: solicitud.body.SEC,
				TIN: solicitud.body.TIN
			},

			Datos_Comp: {
				PC: solicitud.body.PC,
				MOD: solicitud.body.MOD,
				SER: solicitud.body.SER,
				SO: solicitud.body.SO,
				VSO: solicitud.body.VSO,
				NUSB: solicitud.body.NUSB,
				NR: solicitud.body.NR,
				NAUD: solicitud.body.NAUD,
				TPV: solicitud.body.TPV
			},

			Condiciones_PC: {
				CG: solicitud.body.CG,
				NAS: solicitud.body.NAS,
				TECL: solicitud.body.TECL,
				M: solicitud.body.M,
				PANT: solicitud.body.PANT,
				BATT: solicitud.body.BATT,
				CAM: solicitud.body.CAM,
				COR: solicitud.body.COR,
				EUSB: solicitud.body.EUSB,
				USBO: solicitud.body.USBO,
				EPV: solicitud.body.EPV,
				ER: solicitud.body.ER,
				EWF: solicitud.body.EWF,
				PCR: solicitud.body.PCR,
				HOT: solicitud.body.HOT,
				CULER: solicitud.body.CULER,
				DISR: solicitud.body.DISR,
				NMD: solicitud.body.NMD,
				UMD: solicitud.body.UMD,
				TD: solicitud.body.TD,
				UTD: solicitud.body.UTD,
				CC: solicitud.body.CC,
				OFF: solicitud.body.OFF,
				GAME: solicitud.body.GAME
			}
		}

	var x = new servicio(nuevo);

	console.log("Esto es lo que voy a guardar: \n"+x+"\n");


	x.save(function(err,x){
			if(err) return console.log(err);
			else {
				return console.log(x);
			}
		});


		respuesta.redirect("/servicio");
});



// Modelo Juego de gerencia

var Schema   = mongoose.Schema;

	var JuegoModelo = new Schema({
		numero: 		{ type: Number },
		question: 		{ type: String },
		a: 				{ type: String },
		b: 				{ type: String },
		c:  			{ type: String },
		d:  			{ type: String },
		sol:  			{ type: String }
	});

var juego = mongoose.model('gerente', JuegoModelo);

var gerente = {
	Ncomodines: {type: Number},
	Npreguntas: {type: Number},
	nombre: 	 {type: String},
	premio: 	 {type: Number}
}

gerente.Ncomodines, gerente.Npreguntas, gerente.premio = 0;

gerente.nombre = 'Eurfran';


servidor.get("/Juego", function(req,res){
	
	res.render("JuegoGerente", {gerente: gerente});
});






servidor.listen(5000, function(){
	 console.log("Servidor de NodeJs corriendo en http://localhost:5000");
});
