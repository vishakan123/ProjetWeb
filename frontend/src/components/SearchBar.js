import React from 'react';
import './SearchBar.css'; // <-- Import du CSS

// Reçoit searchTerm et onSearchTermChange en props
function SearchBar({ searchTerm, onSearchTermChange }) {

  // Fonction pour gérer le changement dans l'input
  const handleInputChange = (event) => {
    onSearchTermChange(event.target.value); // Appelle la fonction du parent
  };

  return (
    // Conteneur de la barre de recherche
    <div className="search-bar">
      <input
        type="text"
        placeholder="Rechercher par titre ou auteur..." // Placeholder plus précis
        value={searchTerm} // Lié à l'état du parent (App)
        onChange={handleInputChange} // Met à jour l'état du parent
      />
      {/* L'icône est ajoutée via le CSS avec ::after */}
    </div>
  );
}

export default SearchBar;