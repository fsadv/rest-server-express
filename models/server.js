const express = require('express');
const cors = require('cors');
const { dbCon } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';


        //Conexion BD
        this.conectarDB();

        //Middlewares
        this.middlewares();
                
        //Rutas de mi app
        this.routes();
    }

    async conectarDB() {
        await dbCon();
    }

    middlewares() {

        //CORS
        this.app.use( cors() );

        //Lectura y parseo del body
        this.app.use( express.json() );

        //Directorio publico
        this.app.use( express.static('public') );
        
    }

    routes() {

        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en: https://localhost:${this.port}`);
        });
    }

}


module.exports = Server;