// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Si tu l'utilises
const path = require("path"); // Si tu l'utilises
const connectDB = require("./config/db"); // <-- Importe la fonction

// Charger les variables d'environnement
dotenv.config();

// Importer les fichiers de routes (après dotenv et connectDB)
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");

// Se connecter à MongoDB AVANT de configurer et lancer le serveur Express
connectDB()
  .then((conn) => {
    console.log(`MongoDB Connecté depuis server.js: ${conn.connection.host}`); // Log ici !

    // Initialiser Express seulement après la connexion DB réussie
    const app = express();

    // Middlewares
    app.use(cors()); // Gérer les requêtes cross-origin
    app.use(express.json()); // Pour parser le JSON dans les requêtes (req.body)
    // Autres middlewares si tu en as

    // Monter les routes API
    app.use("/api/auth", authRoutes);
    app.use("/api/books", bookRoutes);
    // Autres routes...

    // Gestion des erreurs (exemple simple, à placer après les routes)
    // app.use((err, req, res, next) => { ... });

    // Démarrer le serveur Express
    const PORT = process.env.PORT || 5000; // Utilise le port du .env ou 5000 par défaut
    app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
  })
  .catch((err) => {
    // Si connectDB() échoue (throw error ou process.exit), ce catch pourrait ne pas être atteint
    // mais c'est une sécurité supplémentaire. process.exit(1) dans connectDB est plus direct.
    console.error(
      "Impossible de démarrer le serveur car la connexion à MongoDB a échoué.",
      err
    );
    process.exit(1);
  });
