// models/Book.js
const mongoose = require('mongoose');

// Définition du schéma pour un livre
const bookSchema = new mongoose.Schema(
  {
    // Champ Titre : requis, de type chaîne de caractères
    title: {
      type: String,
      required: [true, 'Le titre du livre est obligatoire'], // Message d'erreur si manquant
      trim: true, // Enlève les espaces inutiles au début et à la fin
    },
    // Champ Auteur : requis, de type chaîne de caractères
    author: {
      type: String,
      required: [true, 'Le nom de l\'auteur est obligatoire'],
      trim: true,
    },
    // Champ Description (Optionnel) : chaîne de caractères
    description: {
      type: String,
      trim: true,
      default: '', // Valeur par défaut si non fourni
    },
    // Champ pour l'URL de l'image de couverture (Optionnel)
    coverImage: {
        type: String,
        trim: true,
        default: '',
    },
    // Champ ISBN (Optionnel, mais utile pour identifier un livre de manière unique)
    isbn: {
        type: String,
        trim: true,
        // unique: true, // Tu pourrais rendre l'ISBN unique si tu le souhaites
        default: '',
    },
    // Tu pourrais ajouter d'autres champs ici si nécessaire :
    // - publishedYear: { type: Number }
    // - genre: { type: String }
    // - pageCount: { type: Number }

    // Optionnel : Liaison à l'utilisateur qui a ajouté le livre
    // Si tu veux savoir qui a ajouté quoi (nécessite d'être connecté pour ajouter)
    /*
    addedBy: {
      type: mongoose.Schema.Types.ObjectId, // Référence à l'ID d'un utilisateur
      required: true,
      ref: 'User', // Fait référence au modèle 'User'
    },
    */

  },
  {
    // Options du schéma
    timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
  }
);

// Création du modèle 'Book' basé sur le schéma 'bookSchema'
const Book = mongoose.model('Book', bookSchema);

// Exporte le modèle pour pouvoir l'utiliser ailleurs (dans les contrôleurs, le script de seed)
module.exports = Book;