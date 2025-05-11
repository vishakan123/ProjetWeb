import React from 'react';
import './SortOptions.css'; // Assure-toi que le CSS est importé

// Reçoit onSortChange ET activeSortCriteria en props
function SortOptions({ onSortChange, activeSortCriteria }) {
  // console.log("Critère Actif reçu:", activeSortCriteria); // Garde si besoin de débugger

  return (
    <div className="sort-options">
      <span>Trier par : </span>
      {/* Ajoute la classe 'active' dynamiquement si le critère correspond */}
      <button
        className={`btn btn-secondary ${activeSortCriteria === 'title-asc' ? 'active' : ''}`}
        onClick={() => onSortChange('title-asc')}
      >
        Titre (A-Z)
      </button>
      <button
        className={`btn btn-secondary ${activeSortCriteria === 'title-desc' ? 'active' : ''}`}
        onClick={() => onSortChange('title-desc')}
      >
        Titre (Z-A)
      </button>
      <button
        className={`btn btn-secondary ${activeSortCriteria === 'author-asc' ? 'active' : ''}`}
        onClick={() => onSortChange('author-asc')}
      >
        Auteur (A-Z)
      </button>
      <button
        className={`btn btn-secondary ${activeSortCriteria === 'author-desc' ? 'active' : ''}`}
        onClick={() => onSortChange('author-desc')}
      >
        Auteur (Z-A)
      </button>
      <button
        className={`btn btn-secondary ${activeSortCriteria === '' ? 'active' : ''}`} // Actif si vide (Défaut)
        onClick={() => onSortChange('')}
      >
        Défaut
      </button>
    </div>
  );
}

export default SortOptions;