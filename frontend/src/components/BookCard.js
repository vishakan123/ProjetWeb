// src/components/BookCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

function BookCard({ id, title, author, isInWishlist, onToggleWishlist, onDeleteBook }) { 
  
  if (!id) {
      console.warn("BookCard reçue sans ID valide:", {id, title});
      return null;
  }

  const wishlistButtonClass = isInWishlist ? 'is-in-wishlist' : 'not-in-wishlist';
  const wishlistIcon = isInWishlist ? '❤️' : '🤍';

  const handleDeleteClick = (event) => {
      event.stopPropagation();
      // --- AJOUT DU LOG ICI ---
      console.log(`[BookCard] handleDeleteClick appelé pour ID: ${id}`);
      // --- FIN DU LOG ---
      onDeleteBook(id); // Appelle la fonction reçue en prop
  };

   const handleWishlistClick = (event) => {
       event.stopPropagation();
       onToggleWishlist(id);
   };

  return (
    <div className="book-card">
      <div className="book-card-actions">
        <Link to={`/book/edit/${id}`} className="edit-link btn-icon" title="Modifier">✏️</Link>
        <button 
          className="delete-button btn-icon" 
          onClick={handleDeleteClick} // Le onClick est ici
          aria-label="Supprimer"
          title="Supprimer"
        >
          🗑️
        </button>
        <button 
          className={`wishlist-button ${wishlistButtonClass} btn-icon`} 
          onClick={handleWishlistClick} 
          aria-label={isInWishlist ? "Retirer wishlist" : "Ajouter wishlist"}
          title={isInWishlist ? "Retirer wishlist" : "Ajouter wishlist"}
        >
          {wishlistIcon}
        </button>
      </div>
       <div className="book-card-image-placeholder">(Image Bientôt Disponible)</div>
       <div className="book-card-content">
         <Link to={`/book/${id}`} title={`Détails de "${title}"`} style={{ textDecoration: 'none', color: 'inherit' }}>
           <h3>{title || 'Titre Inconnu'}</h3>
         </Link>
         <p>{author || 'Auteur Inconnu'}</p>
       </div>
    </div>
  );
}

// Pas besoin de React.memo pour l'instant si on débogue
export default BookCard;