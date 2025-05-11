// src/components/BookList.js
import React from 'react';
import BookCard from './BookCard'; 
import './BookList.css'; 

// Supprime les types si pas TypeScript
function BookList({ books, onToggleWishlist, onDeleteBook }) {
  
  // --- AJOUT DU LOG ICI ---
  console.log("[BookList] Prop 'onDeleteBook' reçue est de type:", typeof onDeleteBook);
  // --- FIN DU LOG ---

  if (!Array.isArray(books) || books.length === 0) {
    return <p>Aucun livre à afficher.</p>; 
  }

  return (
    <div className="book-list">
      {books.map((book) => {
        if (!book || !book._id) {
           console.warn("BookList: Ignore le rendu d'un livre sans _id:", book);
           return null; 
        }
        return (
          <BookCard
            key={book._id}       
            id={book._id}        // Passe _id comme prop 'id'
            title={book.title}
            author={book.author}
            isInWishlist={book.isInWishlist || false} 
            onToggleWishlist={onToggleWishlist}
            onDeleteBook={onDeleteBook} // Passe la prop reçue
          />
        );
      })}
    </div>
  );
}

// Pas besoin de React.memo pour l'instant si on débogue
export default BookList; 