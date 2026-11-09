# API REST de gestion d'utilisateurs — Node.js

> API REST construite avec **Node.js / Express** et l'ORM **Prisma**, exposant un CRUD complet sur une ressource *utilisateur*. Projet d'apprentissage du développement back-end.

![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933)
![Prisma](https://img.shields.io/badge/ORM-Prisma%207-2D3748)
![DB](https://img.shields.io/badge/DB-SQLite-blue)

---

## 🎯 Objectif

Mettre en pratique la construction d'une **API REST** structurée (routes, contrôleurs, services) et la persistance des données avec un **ORM**, selon une séparation claire des responsabilités.

## 🧱 Stack technique

- **Node.js** + **Express 5** — serveur et routage
- **Prisma 7** — ORM (modélisation, requêtes, migrations)
- **SQLite** — base de données (via l'adaptateur `better-sqlite3`)
- **dotenv** — gestion des variables d'environnement
- **Prettier** — formatage du code

## 🗂️ Architecture du projet

```
src/
├── server.js              # Point d'entrée : configuration Express
└── users/
    ├── user.route.js      # Définition des routes
    ├── users.controller.js# Gestion des requêtes / réponses HTTP
    ├── users.service.js   # Logique métier et accès aux données
    └── users.validation.js# Validation des entrées
prisma/                    # Schéma de données (modèle User)
```

Cette organisation **route → contrôleur → service** sépare le transport HTTP de la logique métier, ce qui rend le code plus clair et plus facile à maintenir.

## 📇 Modèle de données (User)

| Champ | Type | Détail |
| --- | --- | --- |
| id | UUID | Identifiant unique |
| name | String | Nom |
| phone | String | Téléphone |
| email | String | Unique |
| password | String | Mot de passe |
| createdAt / updatedAt | DateTime | Dates automatiques |

## 🔌 Endpoints de l'API

| Méthode | Route | Description |
| --- | --- | --- |
| POST | `/users` | Créer un utilisateur |
| POST | `/users/bulk` | Créer plusieurs utilisateurs |
| GET | `/users` | Lister les utilisateurs |
| GET | `/users/search?email=` | Rechercher par e-mail |
| GET | `/users/count` | Compter les utilisateurs |
| GET | `/users/:id` | Récupérer un utilisateur |
| PATCH | `/users/:id` | Mettre à jour un utilisateur |
| PATCH | `/users/:id/password` | Modifier le mot de passe |
| DELETE | `/users/:id` | Supprimer un utilisateur |

## 🚀 Installation et lancement

```bash
# 1. Installer les dépendances
npm install

# 2. Créer un fichier .env
echo "PORT=3000" > .env
echo 'DATABASE_URL="file:./dev.db"' >> .env

# 3. Générer le client Prisma et la base
npx prisma generate
npx prisma migrate dev --name init

# 4. Lancer le serveur
npm run dev        # mode développement (nodemon)
# ou
npm start
```

L'API est alors accessible sur `http://localhost:3000`.

## 🔒 Pistes d'amélioration (sécurité)

En tant que projet d'apprentissage, l'API peut être durcie. Prochaines étapes identifiées :

- **Hachage des mots de passe** (bcrypt / argon2) au lieu d'un stockage en clair
- **Authentification** par token (JWT) et contrôle des accès
- **Validation renforcée** des entrées et gestion centralisée des erreurs
- **Limitation de débit** (rate limiting) pour prévenir le brute force

---

*Projet réalisé par Fadyl Adissa ROUFAI.*
