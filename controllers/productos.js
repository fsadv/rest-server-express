const {response} = require('express');
const {Producto} = require('../models/');



 
const getProductos = async(req = request,res = response) => {

    const { limit = 5, desde = 0 } = req.query;    

    const [total, productos] = await Promise.all([
        Producto.countDocuments({estado:true}),
        Producto.find({estado:true}) 
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(desde)
        .limit(limit)
    ]);

    res.status(200).json({
        total,
        productos
    });
};



const getProducto = async(req, res=response) => {

    const {id} = req.params;
    const producto = await Producto.findById(id)
                    .populate('usuario', 'nombre')
                    .populate('categoria', 'nombre');

    res.status(200).json({
        producto
    });

}



const putProducto = async (req ,res = response) => {

    const {id} = req.params;
    const {estado, usuario, ...data} =  req.body;

    if(data.nombre){
    data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new:true})
                                    .populate('usuario', 'nombre')
                                    .populate('categoria', 'nombre');
    
    res.status(200).json({
        producto
    })

  
};

const deleteProducto = async(req, res=response) => {

    const {id} = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {estado:false}, {new:true});
    const usuarioAutenticado = req.usuario;

    res.status(200).json({producto, usuarioAutenticado});
  
}

const postProducto = async(req, res = response) => {
   
    const {estado, usuario, ...body} = req.body;
    

    const productoDB = await Producto.findOne({nombre: body.nombre});

    if(productoDB) {
        return res.status(400).json({
            msg:`El Producto ${productoDB.nombre}, ya existe`
        });
    }

    //Generar data a guardar

   const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id
   }
    
    const producto = new Producto(data);

    await producto.save();

    res.status(201).json(producto);

};




module.exports = {
    postProducto,
    getProductos,
    getProducto,
    putProducto,
    deleteProducto    
}