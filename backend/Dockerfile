# Étape 1 : Utiliser une image de base Node.js
FROM node:18

# Étape 2 : Créer un dossier de travail dans le conteneur
WORKDIR /app

# Étape 3 : Copier les fichiers de l'app dans le conteneur
COPY . .

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Exposer le port (doit correspondre à celui utilisé dans server.js, ex: 5000)
EXPOSE 5000

# Étape 6 : Lancer le serveur
CMD ["node", "server.js"]
 
