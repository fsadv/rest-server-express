const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbCon } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            uploads:     '/api/uploads',
            usuarios:   '/api/usuarios'
        }


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

        //Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath : true,
        }));
        
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));  
        this.app.use(this.paths.categorias, require('../routes/categorias'));      
        this.app.use(this.paths.productos, require('../routes/productos'));   
        this.app.use(this.paths.buscar, require('../routes/buscar'));  
        this.app.use(this.paths.uploads, require('../routes/uploads')); 
    }

    listen() {
        
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en: https://localhost:${this.port}`);
        });
    }

}


module.exports = Server;