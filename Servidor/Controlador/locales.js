var local = require('../../Servidor/Modelos/m-locales');
var productos = require('./productos');


module.exports.registrarLocal= function(req,res)
    {
        

        var nuevo = {

                nombre:     req.body.nombre,
                Rif:        req.body.Rif,
                compania:   req.body.compania,
                tipo:       req.body.tipo,
                contrasena: req.body.contrasena,
                reputacion: "0",
                correo:     req.body.correo+'@gmail.com',
                
                informacionContacto:{
                    direccion:  { 
                        pais:   req.body.pais,
                        estado: req.body.estado,
                        municipio: req.body.municipio,
                        calle: req.body.calle
                     },
                    numero: req.body.numero
                    }
                }   
                

        var nuevoLocal = new local(nuevo);

        try {
            console.log("\nEsto es lo que va a guardarse en la tabla Locales: \n");
            console.log(nuevoLocal);

            nuevoLocal.save(

                function(err,nuevoLocal){
                    
                    if(err) return console.log(String(err));
                    
                    else return console.log("\nLocal Registrado exitosamente");

                                    });

                    }

        catch(e) {

            console.log(String(e));
                            }
       


                };

module.exports.BuscarLocal = function(req, res, usuario)
    {

        try 
            {
                console.log("\n Voy a Buscar el local: \n")
            
                local.find({_id: req.id},function(err, registros){
                
                    if(err)
                        {
                            console.log(String(err));

                            res.render("index", {Usuario: usuario});  
                            
                                            }

                    else
                        {

                            var tienda = registros[0];

                            console.log("Este es la tienda encontrada: \n");
                            console.log(tienda);

                            productos.Inventario(req, res, usuario, registros[0]) 

                                                }
                                    });



                    } 

        catch(e) 
            {
    
                console.log(String(e));

                        }


                };

module.exports.Logear = function(req, res, usuario)
    {

        try 
            {
                
                local.find({correo: req.body.correo, contrasena: req.body.pass}, 
                    function(err,registros)
                        {
                
                            if(err) console.log(String(err));
                            

                            else {
                                    //req.session = registros[0];
                                    
                                    usuario.id = registros[0].id;
                                    usuario.nombre=registros[0].nombre;
                                    usuario.logeado=true;
                                    usuario.cuenta = 'Tienda';

                                    req.session.user_id = registros[0].id;

                                    console.log("\nEsta es el UserId de la cuenta: \n")
                                    console.log(req.session.user_id);


                                    productos.Inventario(req, res, usuario, registros[0])


                                                    
                                    
                                                    }
                            });
                                } 

        catch(e) 
            {
            
                console.log(String(e));
                                }

        

                            };

module.exports.EliminarP = function(req, res, usuario)
    {
        productos.EliminarProductos(req, res, usuario);

                        };

module.exports.Editar = function (req, res, usuario){
    
    try 
        {
            local.findOne({_id: usuario.id}, function(err, documento){

                    if(req.body.nombre) documento.nombre= req.body.nombre;
                    if(req.body.Rif) documento.Rif = req.body.Rif;
                    if(req.body.contrasena) documento.contrasena = req.body.contrasena;
                    if(req.body.correo) documento.correo = req.body.correo;
                    
                    try {
                        if(req.file.filename) documento.img   = req.file.filename;
                    } catch(e) {
                        
                        console.log(e);
                        res.render("index", {Usuario: usuario});
                    }
                    


                    documento.save(function(e){
                        if(e) console.log(String(e));
                        else 
                            {
                                console.log("Elemento actualizado\n");
                                res.render("index", {Usuario: usuario});
                                        }
                        });



                                        });



                }
                    
    catch(e) 
        {

            console.log(String(e));
            rres.render("index", {Usuario: usuario});
                        }

    };

