// src/services/api.js
import axios from "axios";

// Crée une instance Axios de base
const api = axios.create({
  // Tu pourrais définir une baseURL ici si toutes tes routes API commencent pareil,
  // par exemple: baseURL: 'http://localhost:5000/api'
  // Mais pour l'instant, on mettra les URL complètes dans les services.
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajoute un intercepteur de requête pour injecter le token JWT
api.interceptors.request.use(
  (config) => {
    // Récupère le token depuis le localStorage AVANT chaque requête
    const token = localStorage.getItem("userToken");
    // Log pour voir si l'intercepteur fonctionne
    // console.log(`[Axios Interceptor] Vérification token pour requête vers ${config.url}: ${token ? 'Token trouvé' : 'Pas de token'}`);

    if (token) {
      // Si un token existe, l'ajoute au header Authorization
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // S'il n'y a pas de token, s'assurer que le header n'est pas envoyé (au cas où)
      delete config.headers.Authorization;
    }
    // Retourne la configuration (modifiée ou non) pour que la requête puisse continuer
    return config;
  },
  (error) => {
    // Gère les erreurs qui pourraient survenir AVANT l'envoi de la requête
    console.error("[Axios Interceptor] Erreur avant envoi requête:", error);
    return Promise.reject(error);
  }
);

/* 
// Optionnel : Intercepteur de réponse (comme vu précédemment)
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.status === 401) {
      // ... gérer l'erreur 401 globalement ...
      console.error('[Axios Interceptor] Erreur 401 reçue ! Déconnexion probable nécessaire.');
      // localStorage.removeItem('userToken');
      // localStorage.removeItem('userInfo');
      // window.location.href = '/login'; 
    }
    return Promise.reject(error); 
  }
);
*/

// Exporte l'instance Axios configurée pour être utilisée par les autres services
export default api;
