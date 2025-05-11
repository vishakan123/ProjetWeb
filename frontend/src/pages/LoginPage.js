// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react'; 
import { useNavigate, Link } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth(); 

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        
        // ---> AJOUT DES LOGS ICI <---
        console.log("[LOGIN] handleSubmit - Valeur de 'email' au début:", email);
        console.log("[LOGIN] handleSubmit - Valeur de 'password' au début:", password ? '****** (non vide)' : 'VIDE'); 
        // ---> FIN DES LOGS AJOUTÉS <---

        // setError(''); // On laisse commenté pour voir les erreurs précédentes si besoin
        setIsSubmitting(true); 

        if (!email || !password) { 
            console.log("[LOGIN] Condition (!email || !password) est VRAIE"); // Log pour voir si on entre ici
            setError('Veuillez remplir tous les champs.'); 
            setIsSubmitting(false); 
            return; 
        } else {
             console.log("[LOGIN] Condition (!email || !password) est FAUSSE"); // Log pour voir si on passe
        }

        try {
            await login(email, password); 
            console.log('Connexion réussie depuis LoginPage!'); 
            setError(''); // Efface l'erreur en cas de succès
            navigate('/'); 
        } catch (err) {
            console.error("Erreur attrapée dans LoginPage:", err);
            let displayErrorMessage = 'Erreur lors de la connexion. Veuillez réessayer.'; 
            if (err && err.message) { 
                displayErrorMessage = err.message;
            } else if (typeof err === 'string') { 
                displayErrorMessage = err;
            }
            setError(displayErrorMessage);
            console.log("LoginPage - État 'error' mis à jour avec:", displayErrorMessage);
        } finally {
            setIsSubmitting(false); 
        }
    };

    console.log("LoginPage - Valeur actuelle de l'état 'error' (avant le return):", error);

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Connexion</h2>
            
            {/* Affichage conditionnel du message d'erreur */}
            {error && (
                 <p style={{ 
                    color: 'red', 
                    textAlign: 'center', 
                    marginBottom: '15px', 
                    border: '1px solid red', 
                    padding: '10px', 
                    background: '#ffebee',
                    borderRadius: '4px'
                }}>
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email :</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Vérifie que c'est bien setEmail
                        required
                        disabled={isSubmitting}
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Mot de passe :</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Vérifie que c'est bien setPassword
                        required
                        disabled={isSubmitting}
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        backgroundColor: isSubmitting ? '#ccc' : '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        fontSize: '16px'
                    }}
                >
                    {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
                Pas encore de compte ? <Link to="/register">Inscrivez-vous ici</Link>
            </p>
        </div>
    );
};

export default LoginPage;