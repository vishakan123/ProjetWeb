// routes/books.js
const express = require('express');
const router = express.Router();
const Book = require('../models/Book'); // Importe le modèle Book
const { protect } = require('../middleware/authMiddleware'); // Importe le middleware de protection

// -----------------------------------------------------------------------------
// Route GET /api/books - Récupérer tous les livres (Publique)
// -----------------------------------------------------------------------------
router.get("/", async (req, res) => { 
  console.log("Route GET /api/books (publique) appelée - Lecture depuis MongoDB..."); 
  try {
    const booksFromDB = await Book.find({}); 
    console.log(`Route GET /api/books : ${Array.isArray(booksFromDB) ? booksFromDB.length : 'type invalide'} livres trouvés.`);
    res.json(booksFromDB); 
    console.log("Route GET /api/books : Réponse JSON envoyée.");
  } catch (error) {
    console.error("Route GET /api/books : ERREUR dans le bloc try/catch:", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des livres." });
  }
});

// -----------------------------------------------------------------------------
// Route POST /api/books - Ajouter un nouveau livre (Protégée)
// -----------------------------------------------------------------------------
router.post("/", protect, async (req, res) => { 
  console.log("Route POST /api/books (protégée) appelée");
  const { title, author, description, coverImage, isbn } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Le titre et l\'auteur sont obligatoires.' }); 
  }

  try {
    const newBook = new Book({
      title,
      author,
      description: description || '', 
      coverImage: coverImage || '',
      isbn: isbn || '',
      // addedBy: req.user._id // Si tu veux lier à l'utilisateur
    });
    const createdBook = await newBook.save();
    console.log("Route POST /api/books : Livre créé avec succès :", createdBook._id);
    res.status(201).json(createdBook);
  } catch (error) {
    console.error("Erreur lors de la création du livre:", error);
    if (error.name === 'ValidationError') {
       const messages = Object.values(error.errors).map(val => val.message);
       return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: "Erreur serveur lors de la création du livre." });
  }
});

// -----------------------------------------------------------------------------
// Route DELETE /api/books/:id - Supprimer un livre par son ID (Protégée)
// -----------------------------------------------------------------------------
router.delete("/:id", protect, async (req, res) => { 
  console.log(`Route DELETE /api/books/${req.params.id} (protégée) appelée`);
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      await Book.findByIdAndDelete(req.params.id); 
      console.log(`Route DELETE /api/books/${req.params.id} : Livre supprimé.`);
      res.json({ message: 'Livre supprimé avec succès' });
    } else {
      console.log(`Route DELETE /api/books/${req.params.id} : Livre non trouvé.`);
      res.status(404).json({ message: 'Livre non trouvé' });
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du livre:", error);
    if (error.kind === 'ObjectId' || error.name === 'CastError') {
        console.log(`Route DELETE /api/books/${req.params.id} : ID invalide.`);
        return res.status(400).json({ message: 'ID du livre invalide' });
    }
    res.status(500).json({ message: "Erreur serveur lors de la suppression du livre." });
  }
});

// -----------------------------------------------------------------------------
// Route PUT /api/books/:id - Mettre à jour un livre par son ID (Protégée)
// -----------------------------------------------------------------------------
router.put("/:id", protect, async (req, res) => {
  console.log(`Route PUT /api/books/${req.params.id} (protégée) appelée avec body:`, req.body);

  const { title, author, description, coverImage, isbn } = req.body;

  // Construire l'objet des champs à mettre à jour pour ne pas écraser
  // les champs non fournis avec 'undefined'.
  const updateFields = {};
  if (title !== undefined) updateFields.title = title;
  if (author !== undefined) updateFields.author = author;
  if (description !== undefined) updateFields.description = description;
  if (coverImage !== undefined) updateFields.coverImage = coverImage;
  if (isbn !== undefined) updateFields.isbn = isbn;

  // Vérifier qu'il y a au moins un champ à mettre à jour
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: 'Aucune donnée fournie pour la mise à jour.' });
  }
  // Alternativement, tu peux exiger title et author :
  // if (updateFields.title === '' || updateFields.author === '') {
  //   return res.status(400).json({ message: 'Le titre et l\'auteur ne peuvent pas être vides lors d\'une mise à jour.' });
  // }


  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields }, // Utilise $set pour mettre à jour uniquement les champs fournis
      { new: true, runValidators: true, context: 'query' } // context: 'query' est parfois utile pour les validateurs sur update
    );

    if (updatedBook) {
      console.log(`Route PUT /api/books/${req.params.id} : Livre mis à jour avec succès.`);
      res.json(updatedBook);
    } else {
      console.log(`Route PUT /api/books/${req.params.id} : Livre non trouvé pour mise à jour.`);
      res.status(404).json({ message: 'Livre non trouvé' });
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du livre:", error);
    if (error.name === 'ValidationError') {
       const messages = Object.values(error.errors).map(val => val.message);
       return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.kind === 'ObjectId' || error.name === 'CastError') {
        console.log(`Route PUT /api/books/${req.params.id} : ID invalide.`);
        return res.status(400).json({ message: 'ID du livre invalide' });
    }
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour du livre." });
  }
});


// Tu pourrais aussi ajouter une route GET pour un livre spécifique si besoin :
// router.get("/:id", async (req, res) => { /* ... */ });

module.exports = router;