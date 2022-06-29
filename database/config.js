const mongoose = require('mongoose');

const dbCon = async() => {

    try {

        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Base de datos conectada');
        
    } catch (error) {

        console.log(error);
        throw new Error('Error a la hora de conectarse a la BD');
        
    }


}




module.exports = {
    dbCon
}