// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); // Récupère l'état d'authentification et le chargement initial
  const location = useLocation(); // Récupère l'URL actuelle

  // 1. Attendre que le contexte ait fini de vérifier l'authentification initiale
  if (loading) {
    // Affiche un indicateur de chargement pendant la vérification
    // Tu peux mettre un spinner plus élaboré ici si tu veux
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Vérification de l'accès...</p>
        {/* Optionnel: <Spinner /> */}
      </div>
    );
  }

  // 2. Si le chargement est terminé et que l'utilisateur N'EST PAS authentifié
  if (!isAuthenticated) {
    // Redirige l'utilisateur vers la page de login
    // 'replace' évite d'ajouter la page protégée à l'historique de navigation
    // 'state={{ from: location }}' permet de se souvenir d'où venait l'utilisateur,
    // pour pouvoir le rediriger après un login réussi (étape optionnelle à implémenter dans LoginPage)
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3. Si le chargement est terminé et que l'utilisateur EST authentifié
  // Affiche le composant enfant (la page protégée)
  return children;
};

export default ProtectedRoute;