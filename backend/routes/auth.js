// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assure-toi que ce chemin est correct
const bcrypt = require('bcryptjs');    // Si tu l'utilises
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware'); // <<<--- AJOUT DE L'IMPORT

// Route POST pour l'enregistrement (tu as déjà cette partie, je la remets pour le contexte)
// Assure-toi que la logique ici correspond à ce que tu as.
// Par exemple, si ton enregistrement hache le mot de passe.
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
        }

        // Hachage du mot de passe (si tu le fais ici)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword, // Sauvegarde le mot de passe haché
        });

        if (user) {
            // Tu pourrais choisir de renvoyer un token ici aussi, ou juste un message de succès
            res.status(201).json({
                message: 'Utilisateur créé avec succès',
                // Optionnel : renvoyer des infos utilisateur ou un token
                // _id: user._id,
                // name: user.name,
                // email: user.email,
                // token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
            });
        } else {
            res.status(400).json({ message: 'Données utilisateur invalides' });
        }
    } catch (error) {
        console.error("Erreur register:", error);
        res.status(500).json({ message: 'Erreur serveur lors de l\'enregistrement' });
    }
});


// Route POST pour la connexion (tu as déjà cette partie)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Utilisateur non trouvé" });
        }

        const isMatch = await bcrypt.compare(password, user.password); // Assure-toi d'utiliser bcrypt si le mdp est haché
        if (!isMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name, // Si 'name' existe dans ton modèle
                email: user.email
            }
        });
    } catch (err) {
        console.error("Erreur login:", err);
        res.status(500).json({ error: err.message });
    }
});


// NOUVELLE ROUTE GET pour récupérer le profil de l'utilisateur connecté
router.get('/me', protect, async (req, res) => {
    // Si le middleware 'protect' passe, req.user est défini et contient l'utilisateur (sans le mot de passe)
    try {
        // req.user a été peuplé par le middleware protect
        const user = req.user;

        res.json({
            id: user._id,
            name: user.name,     // Assure-toi que 'name' existe dans ton modèle User.js
            email: user.email,
            // Ajoute d'autres champs si nécessaire, mais jamais le mot de passe
        });
    } catch (error) {
        // Cette erreur est moins probable ici si protect a bien fonctionné
        // mais c'est une bonne pratique de l'avoir.
        console.error("Erreur dans la route /me:", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des informations utilisateur" });
    }
});


module.exports = router;