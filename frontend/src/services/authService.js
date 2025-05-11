// src/services/authService.js
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/auth";

/**
 * Fonction pour connecter un utilisateur.
 * @param {string} email L'email de l'utilisateur.
 * @param {string} password Le mot de passe de l'utilisateur.
 * @returns {Promise<object>} La promesse résolue avec les données { token, user }, ou rejetée avec une erreur.
 */
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    if (response.data && response.data.token) {
      return response.data;
    } else {
      throw new Error("Réponse invalide du serveur lors de la connexion.");
    }
  } catch (error) {
    console.error(
      "Erreur dans authService.login:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Erreur de connexion inconnue");
  }
};

/**
 * Fonction pour inscrire un nouvel utilisateur.
 * @param {string} name Le nom de l'utilisateur.
 * @param {string} email L'email de l'utilisateur.
 * @param {string} password Le mot de passe de l'utilisateur.
 * @returns {Promise<object>} La promesse résolue avec la réponse du backend (ex: { message: "Utilisateur créé" }), ou rejetée avec une erreur.
 */
const register = async (name, email, password) => {
  // <--- NOUVELLE FONCTION
  console.log(`API Service: Appel de POST ${API_URL}/register...`);
  try {
    // La route register est publique, pas besoin de token
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
    });
    // Le backend actuel renvoie { message: "Utilisateur créé" } en cas de succès (status 201)
    return response.data;
  } catch (error) {
    // L'erreur peut être due à un email déjà utilisé (400) ou autre problème serveur (500)
    console.error(
      "Erreur dans authService.register:",
      error.response ? error.response.data : error.message
    );
    // Relance l'erreur (qui devrait contenir le message du backend, ex: "Cet utilisateur existe déjà")
    throw error.response
      ? error.response.data
      : new Error("Erreur d'inscription inconnue");
  }
};

const authService = {
  login,
  register, // <--- AJOUTE register À L'EXPORT
};

export default authService;
