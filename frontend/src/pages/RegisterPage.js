// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import authService from '../services/authService'; 

const RegisterPage = () => {
    const [name, setName] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!name || !email || !password || !confirmPassword) {
            setError('Veuillez remplir tous les champs.');
            setIsSubmitting(false);
            return;
        }
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            setIsSubmitting(false);
            return;
        }

        try {
            console.log('Tentative d\'inscription avec:', { name, email }); // Ne pas loguer le mdp
            const responseData = await authService.register(name, email, password); 
            console.log("Réponse du backend (register):", responseData); 
            
            alert('Inscription réussie ! Vous allez être redirigé vers la page de connexion.'); 
            
            navigate('/login'); 

        } catch (err) {
            console.error("Erreur d'inscription dans RegisterPage:", err);
            setError(err.message || 'Erreur lors de l\'inscription.'); 
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Inscription</h2>
            
            <form onSubmit={handleSubmit}>
                {/* Affichage conditionnel du message d'erreur */}
                {error && (
                    // CORRECTION ICI : Il faut la balise fermante </p>
                    <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px', border: '1px solid red', padding: '10px', background: '#ffebee', borderRadius: '4px' }}>
                        {error}
                    </p> // <-- Correction : c'est bien </p> ici
                )}

                {/* Champs du formulaire */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Nom :</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isSubmitting}
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>
                 <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email :</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Mot de passe :</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isSubmitting}
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>
                 <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>Confirmer le mot de passe :</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isSubmitting}
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>
                
                {/* Bouton S'inscrire */}
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{ width: '100%', padding: '10px', backgroundColor: isSubmitting ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: '16px' }}
                >
                    {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire'}
                </button>
            </form>
             <p style={{ textAlign: 'center', marginTop: '20px' }}>
                Déjà un compte ? <Link to="/login">Connectez-vous ici</Link>
            </p>
        </div>
    );
};

export default RegisterPage;