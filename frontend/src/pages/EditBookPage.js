// src/pages/EditBookPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './EditBookPage.css'; 

// import { Livre } from '../App'; // Si tu utilises TypeScript

/**
 * @param {object} props
 * @param {(import('../App').Livre & { _id?: string })[]} props.livres
 * @param {(bookId: string, updatedData: object) => Promise<any>} props.onBookUpdate // onBookUpdate retourne une Promesse
 */
function EditBookPage({ livres, onBookUpdate }) {
  const params = useParams();
  const navigate = useNavigate();
  const bookIdFromUrl = params.bookId; 

  const livreAModifier = useMemo(() => { /* ... (code existant inchangé) ... */ }, [livres, bookIdFromUrl]);

  // États pour les champs du formulaire
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  // const [description, setDescription] = useState(''); // Décommente et ajoute si besoin
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [error, setError] = useState(''); 

  // Pré-remplissage du formulaire
  useEffect(() => { /* ... (code existant inchangé) ... */ }, [livreAModifier, isFormInitialized]);

  // --- MODIFICATION DE handleSubmit ---
  const handleSubmit = async (event) => { // 'async' ici est optionnel si tu ne fais pas d'autre await
    event.preventDefault();
    setError(''); 
    setIsSubmitting(true);

    if (!title.trim() || !author.trim()) {
        setError("Le titre et l'auteur ne peuvent pas être vides.");
        setIsSubmitting(false);
        return;
    }
    if (!bookIdFromUrl || !livreAModifier) { 
        setError("Impossible de modifier : livre non trouvé ou ID invalide.");
        setIsSubmitting(false);
        return;
    }

    const updatedBookData = { 
      title: title.trim(), 
      author: author.trim(),
      // description: description.trim(), // Ajoute si tu as le champ
    };

    console.log("EditBookPage - Soumission avec ID:", bookIdFromUrl, "et données:", updatedBookData);
    
    try {
      // onBookUpdate (qui est handleUpdateBook de App.js) retourne maintenant une promesse
      await onBookUpdate(bookIdFromUrl, updatedBookData);
      // Si on arrive ici, la mise à jour a réussi dans App.js (y compris la redirection et le toast)
      // On n'a donc plus besoin de naviguer ou d'afficher un toast ici.
      console.log("EditBookPage - onBookUpdate a réussi (promesse résolue).");
      // La redirection est maintenant gérée dans App.js handleUpdateBook.then()
      // navigate(`/book/${bookIdFromUrl}`); // Tu peux enlever ça si App.js redirige

    } catch (apiError) {
      // Le .catch() dans App.js (handleUpdateBook) relance l'erreur, donc on l'attrape ici.
      console.error("EditBookPage - Erreur reçue de onBookUpdate:", apiError);
      setError(apiError.message || "Une erreur est survenue lors de la mise à jour.");
    } finally {
        setIsSubmitting(false);
    }
  };
  // --- FIN MODIFICATION ---
  
  // Blocs de retour conditionnels pour chargement/erreur
  if (!bookIdFromUrl) { /* ... (code existant inchangé) ... */ }
  if (!livreAModifier && !isFormInitialized) { /* ... (code existant inchangé) ... */ }
  if (!livreAModifier && isFormInitialized) { /* ... (code existant inchangé) ... */ }
  
  return (
    // ... (JSX du formulaire existant, il n'a pas besoin de changer) ...
    <div className="edit-book-page">
      <h1>Modifier : {livreAModifier?.title}</h1>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
        <div className="edit-book-form-group">
          <label htmlFor="editTitleInput">Titre : </label>
          <input type="text" id="editTitleInput" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isSubmitting}/>
        </div>
        <div className="edit-book-form-group">
          <label htmlFor="editAuthorInput">Auteur : </label>
          <input type="text" id="editAuthorInput" value={author} onChange={(e) => setAuthor(e.target.value)} required disabled={isSubmitting}/>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={isSubmitting || !isFormInitialized} className="btn btn-primary">
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
          <Link to={livreAModifier ? `/book/${bookIdFromUrl}` : "/"} className="btn btn-secondary">Annuler</Link>
        </div>
      </form>
      <Link to="/" className="btn btn-link back-link" style={{marginTop: '20px', display: 'inline-block'}}>Retour à la liste principale</Link>
    </div>
  );
}

export default EditBookPage;