var producto = require('../../Servidor/Modelos/m-productos');

module.exports.cargarProducto = function(req,res, usuario)
    {
        

        var nuevo = {

                nombre:         req.body.nombre,
                empresa:        req.body.empresa,
                id_local:       usuario.id,
                tipo:           req.body.tprod,
                descripcion:    req.body.descrip,
                precio:         req.body.precio,
                img:            req.file.filename
            
                                }
                

        var nuevoProducto = new producto(nuevo);

        try {
            console.log("\nEsto es lo que va a guardarse en la tabla Productos: \n");
            console.log(nuevoProducto);

            nuevoProducto.save(

                function(err,nuevoProducto){
                    
                    if(err) return console.log(String(err));
                    
                    else return console.log("\nProducto cargado exitosamente");

                                    });

                    }

        catch(e) {

            console.log(String(e));
                            }
       


                };

module.exports.BuscarProductos = function(req, res, usuario, texto)
    {
        try 
            {
                producto.find({}, function(err, documentos){

                    console.log("\nCantidad de Registros: "+documentos.length+"\n");
                    
                    var j=0;
                    var productos=[];

                    for(var i=0; i<documentos.length;i++)
                        {
                        
                            if(err)  console.log(err);
                            
                            else 
                                {

                                    console.log(j+": "+documentos[i].nombre+'\n'+documentos[i].id+"\n");
                                    
                                    if(((documentos[i].nombre).toUpperCase()).indexOf((req.query.texto).toUpperCase())!=-1)
                                        {
                                            productos[j] = documentos[i];
                                            j++;
                                                        }
                                
                                                }

                                        }

                    console.log(productos);

                    if (productos.length < 1) {console.log("\n no encontre nada\n");res.render("busp", {Usuario: usuario, Texto: texto, encontrado: false});}

                    else
                        {

                            res.render("busp", {products: productos, Usuario: usuario, Texto: texto, encontrado: true});
                                }

                                });
                                
                            } 

        catch(e) {
            console.log("\n no encontre nada\n");
            res.render("busp", {Usuario: usuario, Texto: texto, encontrado: false});
            console.log(String(e));
        }


                    };
                    
module.exports.Inventario = function(req, res, usuario, reg)
    {
        producto.find({id_local: reg._id},
            function(err, products)
                {
                    if(err) console.log(String(err));

                    else 
                        {
                            console.log("\n Estos son los productos cargados: \n");
                            console.log(products[0]);

                            res.render("Local",
                                {   
                                    Usuario: usuario, 
                                    datos: reg, 
                                    inventario: true, 
                                    Products: products
                                                });
                                        }

                            }


                );

                    };

module.exports.EliminarProductos = function(req, res, usuario)
    {
        
        try 
            {
                producto.findOneAndRemove({_id: req.idp},
                    function(err)
                        {
                            if(err)
                                {
                                    console.log(err);
                                            }

                                    });
            
                                } 

        catch(e) 
            {
                console.log(String(e));
                                }
                    
                        };

//module.exports.MostrarFicha = function(req)