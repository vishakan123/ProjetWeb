// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService'; // Notre service pour les appels API
import { jwtDecode } from 'jwt-decode'; // Pour décoder le token JWT

// 1. Créer le contexte
const AuthContext = createContext(null);

// 2. Créer le Fournisseur (Provider) du contexte
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Informations de l'utilisateur connecté
    const [token, setToken] = useState(localStorage.getItem('userToken') || null); // Token JWT
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('userToken')); // L'utilisateur est-il authentifié ?
    const [loading, setLoading] = useState(true); // Pour le chargement initial du token/user

    // Effet pour charger l'utilisateur si un token existe au montage du composant
    useEffect(() => {
        console.log('[AuthContext] useEffect - Démarrage, état initial de loading:', loading);
        const storedToken = localStorage.getItem('userToken');
        console.log('[AuthContext] useEffect - Token récupéré de localStorage:', storedToken);

        if (storedToken) {
            try {
                const decodedToken = jwtDecode(storedToken);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    console.log("[AuthContext] useEffect - Token expiré, suppression...");
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('userInfo');
                    setToken(null);
                    setUser(null);
                    setIsAuthenticated(false);
                } else {
                    console.log('[AuthContext] useEffect - Token valide trouvé, mise à jour de l\'état.');
                    setToken(storedToken);
                    setIsAuthenticated(true);
                    const storedUserInfo = localStorage.getItem('userInfo');
                    if (storedUserInfo) {
                        try {
                            setUser(JSON.parse(storedUserInfo));
                            console.log('[AuthContext] useEffect - Informations utilisateur chargées depuis localStorage:', JSON.parse(storedUserInfo));
                        } catch (e) {
                            console.error('[AuthContext] useEffect - Erreur parsing userInfo de localStorage:', e);
                            localStorage.removeItem('userInfo');
                        }
                    }
                }
            } catch (error) {
                console.error("[AuthContext] useEffect - Erreur lors du décodage ou traitement du token:", error);
                localStorage.removeItem('userToken');
                localStorage.removeItem('userInfo');
                setToken(null);
                setUser(null);
                setIsAuthenticated(false);
            }
        } else {
            console.log('[AuthContext] useEffect - Pas de token stocké trouvé.');
        }
        setLoading(false);
        console.log('[AuthContext] useEffect - Fin, état de loading mis à false.');
    }, []); // Tableau de dépendances vide [] pour exécution au montage uniquement

    // Fonction de connexion
    const login = async (email, password) => {
        console.log('[AuthContext] login - Tentative de connexion...');
        // Optionnel: setLoading(true) si tu veux un indicateur de chargement pendant le login
        try {
            const data = await authService.login(email, password); // data = { token, user: { id, email, name? } }
            if (data.token && data.user) {
                console.log('[AuthContext] login - Connexion réussie, data:', data);
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userInfo', JSON.stringify(data.user));
                setToken(data.token);
                setUser(data.user);
                setIsAuthenticated(true);
                // Optionnel: setLoading(false)
                return data; // Retourne les données en cas de succès
            } else {
                // Si la réponse du backend n'a pas le format attendu
                throw new Error("Données de connexion invalides reçues du serveur.");
            }
        } catch (error) {
            console.error("[AuthContext] login - Erreur:", error.message || error);
            // Nettoyage en cas d'échec du login
            localStorage.removeItem('userToken');
            localStorage.removeItem('userInfo');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            // Optionnel: setLoading(false)
            
            // --- LIGNE CRUCIALE ---
            // Relance l'erreur pour que le composant appelant (LoginPage) puisse l'attraper et afficher un message.
            throw error; 
            // --- FIN DE LA LIGNE CRUCIALE ---
        }
    };

    // Fonction de déconnexion
    const logout = () => {
        console.log('[AuthContext] logout - Déconnexion...');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    // Fonction d'inscription (placeholder)
    const register = async (name, email, password) => {
        console.log("[AuthContext] register - Fonction à implémenter. Données:", { name, email });
        // À implémenter plus tard
    };

    // Valeurs fournies par le contexte
    const value = {
        user,
        token,
        isAuthenticated,
        loading, // État de chargement initial
        login,
        logout,
        register,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined || context === null) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    return context;
};