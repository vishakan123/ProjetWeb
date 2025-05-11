// src/services/bookApi.js
import api from "./api"; // On importe l'instance Axios configurée

// URL de base pour les livres (vérifie port et préfixe)
const API_BOOKS_URL =
  process.env.REACT_APP_BOOK_URL || "http://localhost:5000/api/books";

// Fonction fetchAllBooks (corrigée)
export const fetchAllBooks = async () => {
  console.log(`API Service: Appel de GET ${API_BOOKS_URL}...`);
  try {
    // CORRECTION ICI : Utiliser API_BOOKS_URL
    const response = await api.get(API_BOOKS_URL);
    console.log("API Service: Données reçues de fetchAllBooks:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur dans fetchAllBooks:",
      error.response ? error.response.data : error.message
    );
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Erreur lors de la récupération des livres";
    throw new Error(errorMessage);
  }
};

// Fonction addBook (utilise l'instance 'api' et API_BOOKS_URL)
export const addBook = async (newBookData) => {
  console.log("API Service: addBook() appelant POST", API_BOOKS_URL);
  try {
    const response = await api.post(API_BOOKS_URL, newBookData);
    console.log("API Service: Réponse reçue de addBook:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur dans addBook:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Erreur lors de l'ajout du livre");
  }
};

// Fonction deleteBook (utilise l'instance 'api' et API_BOOKS_URL)
export const deleteBook = async (bookId) => {
  console.log(
    `API Service: deleteBook() appelant DELETE ${API_BOOKS_URL}/${bookId}`
  );
  try {
    const response = await api.delete(`${API_BOOKS_URL}/${bookId}`);
    console.log("API Service: Réponse reçue de deleteBook:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur dans deleteBook:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Erreur lors de la suppression du livre");
  }
};

// Fonction updateBook (utilise l'instance 'api' et API_BOOKS_URL)
export const updateBook = async (bookId, updatedData) => {
  console.log(
    `API Service: updateBook() appelant PUT ${API_BOOKS_URL}/${bookId}`
  );
  try {
    const response = await api.put(`${API_BOOKS_URL}/${bookId}`, updatedData);
    console.log("API Service: Réponse reçue de updateBook:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur dans updateBook:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Erreur lors de la mise à jour du livre");
  }
};

// --- Fonctions Wishlist (encore simulées) ---
export const addToWishlist = (bookId) => {
  console.warn(
    `addToWishlist: APPEL SIMULÉ pour ID ${bookId}, backend non connecté.`
  );
  return Promise.resolve({ success: true });
};
export const removeFromWishlist = (bookId) => {
  console.warn(
    `removeFromWishlist: APPEL SIMULÉ pour ID ${bookId}, backend non connecté.`
  );
  return Promise.resolve({ success: true });
};
