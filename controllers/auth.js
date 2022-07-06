const {response} = require('express');
const Usuario = require('../models/usuario.js');
const bcryptjs = require('bcryptjs');
const {generarJWT} = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify.js');

const login = async (req, res = response) => {

    const {correo, password} = req.body;

    try {

        //Verificar mail
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos'
            });
        }

        //Verificar usuario activo

        /*
        if(usuario.estado===false)
        {
            status 400 - estado inactivo
        }
        */

        //Verificar contraseña
        const validPass = bcryptjs.compareSync(password, usuario.password);
        if(!validPass){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos'
            });
        }
        //Generar JWT
        const token = await generarJWT(usuario.id);
        res.json({
            usuario,
            token
        });



        
    } catch (error) {
        console.log(error)
        res.status(500).json({            
            msg:'Hable con el administrador.'
        })
    }


}

const googleSignIn = async(req, res) => {

    const {id_token} = req.body;    

    try {

        const {correo, nombre, img} = await googleVerify(id_token);
        
        let usuario = await Usuario.findOne({correo});

        console.log(correo, nombre);
        //Si no existe

        if(!usuario) {
            const data = {
                nombre,
                correo,
                password: 'ppp',
                rol:'USER_ROL',
                google:true
            };

            usuario = new Usuario(data);
            console.log(data);
            await usuario.save();
        }


    

           //Generar JWT
           const token = await generarJWT(usuario._id);

        res.json({
            usuario,
            token
        })

        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok:false,
            msg:'El token no se pudo verificar'
        })
    }

  
}


module.exports = {
    login,
    googleSignIn
}