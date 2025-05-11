import React from 'react';
import BookList from '../components/BookList'; // Importe BookList
import { Link } from 'react-router-dom'

// Reçoit les livres de la wishlist et les fonctions d'interaction
function WishlistPage({ wishlistBooks, onToggleWishlist, onDeleteBook }) {
  return (
    <div className="wishlist-page" style={{ padding: '20px 0' }}> {/* Ajoute padding */}
      <h1>Ma Wishlist</h1>
      {wishlistBooks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Votre wishlist est vide pour le moment.</p>
          <Link to="/" className="btn btn-primary">Parcourir les livres</Link>
        </div>
      ) : (
        // Réutilise BookList pour afficher les cartes
        <BookList
          books={wishlistBooks} // Passe les livres filtrés pour la wishlist
          onToggleWishlist={onToggleWishlist}
          onDeleteBook={onDeleteBook}
        />
      )}
    </div>
  );
}

export default WishlistPage;