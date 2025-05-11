// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User.js'); // Assure-toi que ce chemin vers models/User.js est correct

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
            // Récupérer le token du header
            token = req.headers.authorization.split(' ')[1];

            // Vérifier le token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Récupérer l'utilisateur depuis le token et l'attacher à l'objet de requête
            req.user = await User.findById(decoded.id).select('-password'); // Exclut le mot de passe

            if (!req.user) {
                // Ce cas peut arriver si l'utilisateur a été supprimé après la création du token
                return res.status(401).json({ message: 'Non autorisé, utilisateur associé au token introuvable' });
            }

            next(); // Passe au prochain middleware ou à la fonction de la route
        } catch (error) {
            console.error('Erreur dans le middleware protect:', error.message);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Non autorisé, token malformé ou invalide' });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Non autorisé, token expiré' });
            }
            // Pour d'autres erreurs potentielles de jwt.verify ou de la DB
            return res.status(401).json({ message: 'Non autorisé, échec de la validation du token' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Non autorisé, pas de token fourni' });
    }
};

module.exports = { protect };