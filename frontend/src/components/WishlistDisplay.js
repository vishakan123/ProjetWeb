import React from 'react';
import BookCard from './BookCard';
// import './WishlistDisplay.css';

function WishlistDisplay({ wishlistBooks, onToggleWishlist, onDeleteBook }) {
  return (
    <div className="wishlist-display" style={{ marginTop: '40px', borderTop: '3px solid #61dafb', paddingTop: '20px', width: '100%', boxSizing: 'border-box' }}>
      <h2>Ma Wishlist ({wishlistBooks.length})</h2>
      {wishlistBooks.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Votre wishlist est vide pour le moment.</p>
      ) : (
        <div className="book-list">
          {wishlistBooks.map(book => (
            <BookCard
              key={'wishlist-' + book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              isInWishlist={true}
              onToggleWishlist={onToggleWishlist}
              onDeleteBook={onDeleteBook}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistDisplay;