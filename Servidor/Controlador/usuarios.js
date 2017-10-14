
var user = require('../../Servidor/Modelos/m-usuarios');

module.exports.registrarUsuario = function(req,res)
    {
        

        var nuevo = {
                nombre:         req.body.nombre,
                apellido:       req.body.apellido,
                correo:         req.body.correo+'@gmail.com',
                nombreUsuario:  req.body.nombreUsuario,
                contrasena:     req.body.contrasena,
                img: 'img-usuario.png'
                                }
                

        var nuevoUsuario = new user(nuevo);

        try {
            console.log("\nEsto es lo que va a guardarse en la tabla Usuarios: \n");
            console.log(nuevoUsuario);

            nuevoUsuario.save(

                function(err,nuevoUsuario){
                    
                    if(err) return console.log(String(err));
                    
                    else return console.log("\nUsuario Registrado exitosamente");

                                    });

                    }

        catch(e) {

            console.log(String(e));
                            }
       


                };

module.exports.BuscarUsuario = function(req, res, usuario)
    {

        try 
            {
                console.log("\n Voy a Buscar el usuario: \n")
            
                user.find({_id: req.id},function(err, registro){
                
                    if(err)
                        {
                            console.log(String(err));

                            res.render("index", {Usuario: usuario});  
                            
                                            }

                    else
                        {

                            var visitante = registro[0];

                            console.log("Este es el visitante encontrada: \n");
                            console.log(visitante);
                            
                            res.render("User", {Usuario: usuario, datos: visitante});  

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
        user.find({correo: req.body.correo, contrasena: req.body.pass}, function(err,registros){
                
                if(err) console.log(String(err));
                

                else {
                        console.log(registros);
                        usuario.id = registros[0].id;
                        usuario.nombre=registros[0].nombre;
                        usuario.logeado=true;
                        usuario.cuenta = 'Usuario';
                        console.log(usuario);

                        req.session.user_id = registros[0].id;
                        console.log(req.session.user_id);
                                        
                        res.render("User",{Usuario: usuario, datos: registros[0]});
                                        }
                            });

                            };

module.exports.Editar = function (req, res, usuario){
    
    try 
        {
            user.findOne({_id: usuario.id}, function(err, documento){

                    

                    try {
                        if(req.body.contrasena) documento.contrasena = req.body.contrasena;
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