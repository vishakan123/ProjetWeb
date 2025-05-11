import React, { useState } from 'react';
import './AddBookForm.css';

function AddBookForm({ onBookAdd }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim() || !author.trim()) {
      alert("Veuillez remplir le titre et l'auteur.");
      return;
    }
    onBookAdd({ title: title.trim(), author: author.trim() });
    setTitle('');
    setAuthor('');
  };

  return (
    <div className="add-book-form">
      <h2>Ajouter un nouveau livre</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titleInput">Titre : </label>
          <input
            type="text"
            id="titleInput"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="authorInput">Auteur : </label>
          <input
            type="text"
            id="authorInput"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        {/* Applique .btn et .btn-success */}
        <button type="submit" className="btn btn-success add-book-button">Ajouter le livre</button>
      </form>
    </div>
  );
}

export default AddBookForm;