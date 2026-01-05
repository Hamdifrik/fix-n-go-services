# Fix-n-Go Services - Backend API

Backend API pour l'application Fix-n-Go Services, construit avec Node.js, Express et MongoDB.

## 🚀 Installation

### Prérequis

- Node.js (v16 ou supérieur)
- MongoDB (local ou MongoDB Atlas)
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone <votre-repo-backend>
cd backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**

Créer un fichier `.env` à la racine du dossier backend et configurer les variables suivantes:

```env
MONGODB_URI=mongodb://localhost:27017/fixngo
JWT_SECRET=votre_secret_jwt_ultra_securise
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

4. **Démarrer le serveur**

Mode développement:
```bash
npm run dev
```

Mode production:
```bash
npm start
```

Le serveur démarre sur `http://localhost:5000`

## 📁 Structure du projet

```
backend/
├── controllers/      # Logique métier
├── models/          # Modèles MongoDB
├── routes/          # Routes API
├── middleware/      # Middleware personnalisés
├── server.js        # Point d'entrée
├── .env            # Variables d'environnement
└── package.json    # Dépendances
```

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

### Inscription
```
POST /api/auth/register
```

Body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "client",
  "phone": "+1234567890"
}
```

### Connexion
```
POST /api/auth/login
```

Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Réponse:
```json
{
  "success": true,
  "message": "Login successful!",
  "data": {
    "user": { ... },
    "token": "jwt_token_here",
    "role": "client"
  }
}
```

## 📋 Endpoints API

### Auth Routes (`/api/auth`)

- `POST /register` - Inscription
- `POST /login` - Connexion
- `GET /profile` - Obtenir le profil (authentifié)
- `PUT /profile` - Mettre à jour le profil (authentifié)
- `PUT /change-password` - Changer le mot de passe (authentifié)

### Service Routes (`/api/services`)

- `GET /` - Liste de tous les services
- `GET /:id` - Détails d'un service
- `POST /` - Créer un service (helper uniquement)
- `PUT /:id` - Mettre à jour un service (helper uniquement)
- `DELETE /:id` - Supprimer un service (helper uniquement)
- `GET /helper/my-services` - Services du helper connecté

### Booking Routes (`/api/bookings`)

- `POST /` - Créer une réservation (client uniquement)
- `GET /` - Liste des réservations
- `GET /:id` - Détails d'une réservation
- `PUT /:id/status` - Mettre à jour le statut (helper uniquement)
- `PUT /:id/cancel` - Annuler une réservation

### Review Routes (`/api/reviews`)

- `POST /` - Créer un avis (client uniquement)
- `GET /helper/:helperId` - Avis d'un helper
- `PUT /:id/respond` - Répondre à un avis (helper uniquement)

### User Routes (`/api/users`)

- `GET /helpers` - Liste des helpers
- `GET /helpers/:id` - Détails d'un helper
- `GET /stats` - Statistiques de l'utilisateur (authentifié)

### Notification Routes (`/api/notifications`)

- `GET /` - Liste des notifications
- `PUT /:id/read` - Marquer comme lu
- `PUT /read-all` - Tout marquer comme lu
- `DELETE /:id` - Supprimer une notification

## 🔒 Middleware d'authentification

Pour les routes protégées, inclure le token JWT dans le header:

```
Authorization: Bearer <votre_token_jwt>
```

## 🗄️ Modèles de données

### User
- email, password, firstName, lastName, phone
- role: 'client' ou 'helper'
- Helper: expertise, hourlyRate, rating, bio, etc.
- Client: bookingHistory

### Service
- title, description, category, price, duration
- helper (ref)
- images, tags, isActive

### Booking
- client (ref), helper (ref), service (ref)
- scheduledDate, status, address
- totalPrice, paymentStatus

### Review
- booking (ref), client (ref), helper (ref)
- rating, comment, response

### Notification
- user (ref), type, title, message
- isRead, relatedId

## 🚀 Déploiement

### Variables d'environnement production

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fixngo
JWT_SECRET=<secret-ultra-securise>
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://votre-domaine.com
```

## 📝 Notes

- Les mots de passe sont hashés avec bcryptjs
- Les tokens JWT expirent après 7 jours
- Rate limiting recommandé pour la production
- HTTPS fortement recommandé en production
