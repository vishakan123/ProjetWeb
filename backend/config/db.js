// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Assure-toi que MONGO_URI est bien dans ton fichier .env
    // et que dotenv est chargé avant d'appeler connectDB
    if (!process.env.MONGO_URI) {
       throw new Error('ERREUR CRITIQUE: MONGO_URI n\'est pas définie dans le fichier .env');
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI); 
    
    // On ne logue PAS ici, on loguera dans le fichier appelant (server.js ou seed.js)
    // console.log(`MongoDB Connecté: ${conn.connection.host}`); 

    return conn; // Retourne l'objet de connexion si besoin

  } catch (error) {
    console.error(`ERREUR lors de la connexion MongoDB : ${error.message}`);
    process.exit(1); // Arrête le processus en cas d'échec critique
  }
};

module.exports = connectDB;