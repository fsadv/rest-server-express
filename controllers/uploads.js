const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require('express');
const { subirArchivo } = require('../helpers/');
const {Usuario, Producto} = require('../models/index');


const cargarArchivo = async(req, res=response) => {


    try {
      //subir txt o md
      const nombre = await subirArchivo(req.files, undefined, 'imgs');
      res.json({
        nombre
      })

    } catch (error) {
      res.status(400).json({
        error
      })
      
    }
  

    
    

  };
  

  const actualizarImagen = async(req, res = response) => {


    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
      case 'usuarios':
        modelo = await Usuario.findById(id);        
        if(!modelo){
          return res.status(400).json({
            msg:`No existe un usuario con el ID: ${id}`
          });
        }

        break;
      
      case 'productos':
        modelo = await Producto.findById(id);
        if(!modelo){
          res.status(400).json({
            msg:`No existe un producto con el ID: ${id}`
          });
        }

        break;
    
      default:
        return res.status(500).json({
          msg:'No se valido esto'
        });
    }

    //Limpieza de imagens previas

    if(modelo.img) {
      const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
      if(fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
      }
    }
   

     const nombre = await subirArchivo(req.files, undefined, coleccion);
     modelo.img = nombre;
     await modelo.save();
     
    res.json({
      modelo
    })

  }

  const actualizarImagenCloudinary = async(req, res = response) => {


    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
      case 'usuarios':
        modelo = await Usuario.findById(id);        
        if(!modelo){
          return res.status(400).json({
            msg:`No existe un usuario con el ID: ${id}`
          });
        }

        break;
      
      case 'productos':
        modelo = await Producto.findById(id);
        if(!modelo){
          res.status(400).json({
            msg:`No existe un producto con el ID: ${id}`
          });
        }

        break;
    
      default:
        return res.status(500).json({
          msg:'No se valido esto'
        });
    }

    //Limpieza de imagens previas

    if(modelo.img) {
      const nombreArr = modelo.img.split('/');
      const nombre = nombreArr[nombreArr.length - 1];
      const [ public_id ]   = nombre.split('.');

      await cloudinary.uploader.destroy(public_id);
      
    }
    const {tempFilePath} = req.files.archivo;

    const {secure_url} = await cloudinary.uploader.upload( tempFilePath );
    modelo.img = secure_url;
   
/*
     const nombre = await subirArchivo(req.files, undefined, coleccion);
     modelo.img = nombre;
*/
     await modelo.save();
     
    res.json({
      modelo
    })

  }

const mostrarImagen = async(req, res=response) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);        
      if(!modelo){
        return res.status(400).json({
          msg:`No existe un usuario con el ID: ${id}`
        });
      }

      break;
    
    case 'productos':
      modelo = await Producto.findById(id);
      if(!modelo){
        res.status(400).json({
          msg:`No existe un producto con el ID: ${id}`
        });
      }

      break;
  
    default:
      return res.status(500).json({
        msg:'No se valido esto'
      });
  }

  //Limpieza de imagens previas

  if(modelo.img) {
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if(fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }
 
 const pathImagen = path.join(__dirname, '../assets/404img.jpg');
  return res.sendFile(pathImagen);
  



}



module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}