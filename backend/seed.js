// seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Importe ta fonction de connexion DB
const Book = require('./models/Book'); // Importe le modèle Book

// Charger les variables d'environnement (pour récupérer MONGO_URI)
dotenv.config();

// Données initiales à insérer
const initialBooks = [
  { 
    title: "1984", 
    author: "George Orwell", 
    description: "Un roman dystopique sur la surveillance et le totalitarisme.", 
    isbn: "978-2070368228" // Exemple d'ISBN
  },
  { 
    title: "Le Petit Prince", 
    author: "Antoine de Saint-Exupéry", 
    description: "Un conte poétique et philosophique.",
    coverImage: "https://images.epagine.fr/150/9782070612715_1_75.jpg" // Exemple d'URL de couverture
  },
  { 
    title: "L'Étranger", 
    author: "Albert Camus", 
    description: "Un roman sur l'absurdité de la condition humaine." 
  },
  // Ajoute d'autres livres si tu veux
  {
    title: "Orgueil et Préjugés",
    author: "Jane Austen",
    description: "Un classique de la littérature anglaise."
  }
];

// Fonction pour insérer les données
const importData = async () => {
  try {
    // 1. Connexion à la base de données
    await connectDB();
    console.log('MongoDB connecté pour le seeding...');

    // 2. Optionnel : Supprimer les données existantes (pour éviter les doublons si on relance le script)
    await Book.deleteMany();
    console.log('Anciens livres supprimés...');

    // 3. Insérer les nouvelles données
    const createdBooks = await Book.insertMany(initialBooks);
    console.log(`${createdBooks.length} livres insérés avec succès !`);

    // 4. Fermer la connexion
    await mongoose.connection.close();
    console.log('Connexion MongoDB fermée.');
    process.exit(0); // Termine le script avec succès

  } catch (error) {
    console.error(`Erreur lors du seeding : ${error.message}`);
    await mongoose.connection.close(); // Assure-toi de fermer la connexion même en cas d'erreur
    process.exit(1); // Termine le script avec une erreur
  }
};

// Lancer la fonction d'importation
importData();