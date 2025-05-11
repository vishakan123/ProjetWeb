// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Services et Composants
import { fetchAllBooks, addBook, deleteBook, updateBook, addToWishlist, removeFromWishlist } from './services/bookApi';
// import NavigationBar from './components/NavigationBar'; 
import SearchBar from './components/SearchBar';
import SortOptions from './components/SortOptions';
import BookList from './components/BookList';
import AddBookForm from './components/AddBookForm';
import ProtectedRoute from './components/ProtectedRoute'; 

// Pages
import WishlistPage from './pages/WishlistPage';
import BookDetailPage from './pages/BookDetailPage';
import EditBookPage from './pages/EditBookPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 

// Contexte
import { useAuth } from './contexts/AuthContext';

// Styles
import './App.css';

/**
 * @typedef {object} Livre
 * @property {number | string} id 
 * @property {string} title
 * @property {string} author
 * @property {string} [_id] // Spécifiquement pour MongoDB
 * @property {string} [description]
 * @property {string} [coverImage]
 * @property {string} [isbn]
 * @property {boolean} [isInWishlist]
 */

function App() {
  // États locaux
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const [wishlist, setWishlist] = useState(/** @type {(number|string)[]} */ ([]));
  const [livres, setLivres] = useState(/** @type {Livre[]} */ ([]));
  const [booksLoading, setBooksLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // Contexte d'authentification
  const { isAuthenticated, user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Chargement initial des livres
  useEffect(() => {
    console.log("App.js - useEffect pour fetchAllBooks DÉMARRE.");
    setBooksLoading(true);
    setError(null);
    fetchAllBooks()
      .then(data => {
        console.log("App.js - Données reçues dans .then() juste avant setLivres:", data); 
        if (Array.isArray(data)) {
          setLivres(data);
        } else {
          console.error("App.js - Données reçues de fetchAllBooks ne sont pas un tableau:", data);
          setLivres([]); 
          setError("Format de données de livres invalide reçu du serveur.");
          toast.error("Format de données de livres invalide.");
        }
      })
      .catch(err => { 
        console.error("App.js - Erreur dans fetchAllBooks catch:", err);
        setError(err.message || "Erreur inconnue"); 
        toast.error(`Erreur chargement des livres: ${err.message || "Erreur inconnue"}`); 
        setLivres([]); 
      })
      .finally(() => {
        console.log("App.js - useEffect pour fetchAllBooks FINI (finally).");
        setBooksLoading(false);
      });
  }, []); 

  // --- Fonctions Handler ---
  const handleAddBook = (nouveauLivreData) => { 
    const livreExisteDeja = Array.isArray(livres) ? livres.some(livre => livre.title.toLowerCase() === nouveauLivreData.title.toLowerCase() && livre.author.toLowerCase() === nouveauLivreData.author.toLowerCase()) : false;
    if (livreExisteDeja) { toast.warn("Ce livre existe déjà !"); return; }
    addBook(nouveauLivreData) // Appel API
      .then(livreAjoute => { 
          setLivres(prevLivres => Array.isArray(prevLivres) ? [...prevLivres, livreAjoute] : [livreAjoute]); 
          toast.success(`Livre "${livreAjoute.title}" ajouté !`); 
      })
      .catch(err => { console.error(err); toast.error("Erreur lors de l'ajout."); });
   };
  const handleToggleWishlist = (bookId) => { 
    const estDansWishlist = Array.isArray(wishlist) ? wishlist.includes(bookId) : false;
    let nouvelleWishlist;
    const apiCall = estDansWishlist ? removeFromWishlist(bookId) : addToWishlist(bookId); 
    if (estDansWishlist) { nouvelleWishlist = Array.isArray(wishlist) ? wishlist.filter(id => id !== bookId) : []; }
    else { nouvelleWishlist = Array.isArray(wishlist) ? [...wishlist, bookId] : [bookId]; }
    setWishlist(nouvelleWishlist);
    apiCall.catch(err => { console.error(err); setWishlist(wishlist); toast.error("Erreur Wishlist"); });
  };

  const handleDeleteBook = (bookIdToDelete) => { 
    console.log("[App.js] handleDeleteBook - ID reçu:", bookIdToDelete); 
    const livreASupprimer = Array.isArray(livres) ? livres.find(livre => (livre._id || livre.id) === bookIdToDelete) : undefined; 
    if (!livreASupprimer) {
        console.error("[App.js] handleDeleteBook - Livre à supprimer non trouvé avec ID:", bookIdToDelete);
        toast.error("Erreur : Livre à supprimer non trouvé.");
        return;
    }
    const wantsToDelete = window.confirm(`Supprimer "${livreASupprimer.title}" ?`);
    if (wantsToDelete) {
      console.log("[App.js] handleDeleteBook - Confirmation suppression pour ID:", bookIdToDelete);
      deleteBook(bookIdToDelete) 
        .then((response) => { 
            console.log("[App.js] handleDeleteBook - Succès API:", response); 
            setLivres(prevLivres => Array.isArray(prevLivres) ? prevLivres.filter(livre => (livre._id || livre.id) !== bookIdToDelete) : []); 
            setWishlist(prevWishlist => Array.isArray(prevWishlist) ? prevWishlist.filter(id => id !== bookIdToDelete) : []); 
            toast.info(`Livre "${livreASupprimer.title}" supprimé.`); 
        })
        .catch(err => { 
            console.error("[App.js] handleDeleteBook - Erreur API:", err); 
            toast.error(`Erreur suppression: ${err.message || 'Erreur inconnue'}`); 
        });
    } else {
         console.log("[App.js] handleDeleteBook - Suppression annulée par l'utilisateur pour ID:", bookIdToDelete);
    }
  };

  const handleUpdateBook = (bookIdToUpdate, updatedData) => { 
     console.log(`App.js - handleUpdateBook appelé pour ID: ${bookIdToUpdate} avec data:`, updatedData);
     return updateBook(bookIdToUpdate, updatedData) 
       .then(livreMisAJour => {
         console.log("App.js - Mise à jour réussie, livre reçu:", livreMisAJour);
         setLivres(prevLivres => {
           if (!Array.isArray(prevLivres)) return []; 
           return prevLivres.map(livre => {
             const currentId = livre._id || livre.id; 
             if (currentId === bookIdToUpdate) {
               return { ...livre, ...livreMisAJour }; 
             } else {
               return livre;
             }
           });
         });
         toast.success(`Livre "${livreMisAJour.title}" mis à jour !`);
         navigate(`/book/${livreMisAJour._id || livreMisAJour.id || bookIdToUpdate}`); 
         return livreMisAJour; 
       })
       .catch(err => {
         console.error("Erreur lors de la mise à jour dans App.js:", err);
         toast.error(`Erreur mise à jour: ${err.message || 'Erreur inconnue'}`);
         throw err; 
       });
  };

  const handleLogout = () => { 
    logout(); 
    navigate('/login'); 
    toast.info("Vous avez été déconnecté.");
  };

  // --- Affichage de chargement pendant l'initialisation de l'authentification ---
  if (authLoading) {
    return ( 
      <div className="App-loading-fullscreen" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <div className="spinner"></div> 
        <span>Vérification de l'authentification...</span>
      </div>
    );
  }

  // --- Préparation des données pour l'affichage ---
  console.log("App.js - Début préparation affichage - État 'livres':", livres); 
  console.log("App.js - Début préparation affichage - État 'wishlist':", wishlist); 

  const livresFiltres = Array.isArray(livres) 
    ? livres.filter(livre => { 
        if (!livre || typeof livre.title !== 'string' || typeof livre.author !== 'string') return false;
        const titreMinuscule = livre.title.toLowerCase();
        const auteurMinuscule = livre.author.toLowerCase();
        const rechercheMinuscule = searchTerm.toLowerCase();
        return titreMinuscule.includes(rechercheMinuscule) || auteurMinuscule.includes(rechercheMinuscule);
      }) 
    : []; 
  console.log("App.js - Après filtre ('livresFiltres'):", livresFiltres); 

  let livresFiltresEtTries = [...livresFiltres];
  if (sortCriteria === 'title-asc') { livresFiltresEtTries.sort((a, b) => (a?.title || '').localeCompare(b?.title || '')); }
  else if (sortCriteria === 'title-desc') { livresFiltresEtTries.sort((a, b) => (b?.title || '').localeCompare(a?.title || '')); }
  else if (sortCriteria === 'author-asc') { livresFiltresEtTries.sort((a, b) => (a?.author || '').localeCompare(b?.author || '')); }
  else if (sortCriteria === 'author-desc') { livresFiltresEtTries.sort((a, b) => (b?.author || '').localeCompare(a?.author || '')); }
  console.log("App.js - Après tri ('livresFiltresEtTries'):", livresFiltresEtTries); 

  const livresPourAffichage = livresFiltresEtTries.map(livre => ({ 
      ...livre, 
      isInWishlist: Array.isArray(wishlist) ? wishlist.includes(livre?._id || livre?.id) : false 
  })); 
  console.log("App.js - Prêt pour affichage ('livresPourAffichage'):", livresPourAffichage); 

  const livresDeLaWishlist = (Array.isArray(livres) && Array.isArray(wishlist))
     ? livres.filter(livre => livre && wishlist.includes(livre._id || livre.id)).map(livre => ({ ...livre, isInWishlist: true }))
     : []; 
  console.log("App.js - Préparation Wishlist ('livresDeLaWishlist'):", livresDeLaWishlist);

  // --- Rendu Principal ---
  return (
     <div className="App">
        {/* Barre de navigation */}
        <nav style={{ padding: '10px 20px', background: '#333', color: 'white', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div>
             <Link to="/" style={{ marginRight: '15px', textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>Ma Bibliothèque</Link>
             <Link to="/wishlist" style={{ marginRight: '15px', textDecoration: 'none', color: '#ddd' }}>Wishlist ({Array.isArray(wishlist) ? wishlist.length : 0})</Link>
           </div>
           <div>
             {isAuthenticated && user ? (
               <>
                 <span style={{ marginRight: '15px', color: '#ddd' }}>
                   Bonjour, {user.name || user.email}!
                 </span>
                 <button onClick={handleLogout} style={{ padding: '8px 12px', cursor: 'pointer', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>Déconnexion</button>
               </>
             ) : (
                <> 
                    <Link to="/login" style={{ textDecoration: 'none', color: 'white', padding: '8px 12px', background: '#4CAF50', borderRadius: '4px', marginRight: '10px' }}>Connexion</Link>
                    <Link to="/register" style={{ textDecoration: 'none', color: '#ddd' }}>Inscription</Link>
                </>
             )}
           </div>
         </nav>
        
        <div className="main-container">
          <Routes>
             {/* Route Accueil (publique) */}
             <Route path="/" element={
               <>
                 <div className="controls-section">
                   <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
                   <SortOptions onSortChange={setSortCriteria} activeSortCriteria={sortCriteria} />
                 </div>
                 <div className="content-section">
                   {error ? <p className="error-message">Erreur de chargement: {error}</p> : 
                    booksLoading ? <div className="loading-message"><div className="spinner"></div><span>Chargement des livres...</span></div> : 
                    (livresPourAffichage.length > 0 ? 
                      <BookList 
                        books={livresPourAffichage} 
                        onToggleWishlist={handleToggleWishlist} 
                        onDeleteBook={handleDeleteBook} 
                      />
                      : <p>Aucun livre ne correspond à vos critères.</p> 
                    )
                   }
                   {!booksLoading && !error && isAuthenticated && ( 
                     <>
                       <AddBookForm onBookAdd={handleAddBook} />
                     </>
                   )}
                 </div>
               </>
             } />
             
             {/* Route Wishlist (protégée) */}
             <Route 
               path="/wishlist" 
               element={
                 <ProtectedRoute> 
                   <WishlistPage
                     wishlistBooks={livresDeLaWishlist}
                     onToggleWishlist={handleToggleWishlist}
                     onDeleteBook={handleDeleteBook}
                   />
                 </ProtectedRoute>
               } 
             />
             
             {/* Route Détail Livre (publique) */}
             <Route path="/book/:bookId" element={<BookDetailPage livres={livres} />} />
             
             {/* Route Édition Livre (protégée) */}
             <Route 
               path="/book/edit/:bookId" 
               element={
                 <ProtectedRoute> 
                   <EditBookPage livres={livres} onBookUpdate={handleUpdateBook} />
                 </ProtectedRoute>
               }
             />
             
             {/* Route Login (publique) */}
             <Route path="/login" element={<LoginPage />} />
             
             {/* Route Register (publique) */}
             <Route path="/register" element={<RegisterPage />} /> 
          </Routes>
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
      </div>
  );
}

export default App;