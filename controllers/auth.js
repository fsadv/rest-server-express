const {response} = require('express');
const Usuario = require('../models/usuario.js');
const bcryptjs = require('bcryptjs');
const {generarJWT} = require('../helpers/generar-jwt');

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


module.exports = {
    login
}