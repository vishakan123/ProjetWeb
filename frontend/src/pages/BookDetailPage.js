import React from 'react';
import { useParams, Link } from 'react-router-dom';

// Reçoit la liste locale 'livres' en prop
function BookDetailPage({ livres }) {
  const params = useParams();
  const bookId = params.bookId; // C'est une string
  const bookIdNum = parseInt(bookId || '', 10); // Convertit en nombre

  // Trouve le livre dans la liste locale
  const livreTrouve = React.useMemo(() => {
      if (isNaN(bookIdNum)) return undefined;
      return livres.find(livre => livre.id === bookIdNum);
  }, [bookIdNum, livres]);

  // Pas d'état isLoading/error

  if (isNaN(bookIdNum)) {
    return ( <div style={{ padding: '20px' }}> <h2>ID invalide</h2> <Link to="/">Retour</Link> </div> );
  }
  if (!livreTrouve) {
    return ( <div style={{ padding: '20px' }}> <h2>Livre non trouvé (ID: {bookIdNum})</h2> <Link to="/">Retour</Link> </div> );
  }

  // Affiche les détails
  return (
    <div className="book-detail-page" style={{ padding: '20px' }}>
      <h1>{livreTrouve.title}</h1>
      <h2 style={{ color: '#555', fontStyle: 'italic', fontWeight: 400, marginBottom: '20px' }}>
        par {livreTrouve.author}
      </h2>
      {livreTrouve.coverUrl && (<img src={livreTrouve.coverUrl} alt={`Couverture de ${livreTrouve.title}`} style={{ maxWidth: '150px', float: 'left', marginRight: '20px', marginBottom: '10px', border: '1px solid #eee' }}/>)}
      {livreTrouve.description && ( <p>{livreTrouve.description}</p> )}
      <div style={{clear: 'both', paddingTop: '15px'}}>
          <p><strong>ID :</strong> {livreTrouve.id}</p>
          {/* Ajoute d'autres champs si définis */}
      </div>
      <hr style={{ margin: '20px 0' }} />
      <Link to="/" className="btn btn-secondary">Retour à la liste</Link>
      <Link to={`/book/edit/${livreTrouve.id}`} className="btn btn-primary" style={{ marginLeft: '10px' }}>Modifier</Link>
    </div>
  );
}

export default BookDetailPage;