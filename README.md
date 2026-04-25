# Sondage Café Sacré Cœur

<div align="center">

![Project Status](https://img.shields.io/badge/Status-Live-success?style=flat-square&logo=netlify&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Tech-React%20%2B%20Vite-blue?style=flat-square&logo=react&logoColor=white)
![UI UX](https://img.shields.io/badge/UI-Artisanal%20Premium-gold?style=flat-square&logo=framer&logoColor=white)
![Database](https://img.shields.io/badge/DB-Supabase-green?style=flat-square&logo=supabase&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-black?style=flat-square)

</div>

Cette application de sondage interactive a été développée pour le **Café Sacré Cœur**. Elle permet d'analyser l'intérêt des clients pour l'implémentation d'un système de matching communautaire à travers une interface utilisateur optimisée et immersive.

---

## Fonctionnalités Principales

- **Optimisation Mobile :** Interface conçue prioritairement pour une utilisation tactile fluide et réactive sur smartphone.
- **Identité Visuelle Premium :** Système de design artisanal basé sur une palette Espresso-Cream-Gold et l'utilisation de la typographie Playfair Display.
- **Orchestration d'Animations :** Transitions d'écrans fluides gérées par Framer Motion et intégration d'effets visuels avancés.
- **Parcours Utilisateur Segmenté :** Questionnaire intelligent permettant d'identifier les profils d'utilisateurs et leurs préférences d'activités.
- **Analyse de l'Engagement :** Système de scoring intégré pour évaluer quantitativement l'intérêt des répondants.
- **Gestion des Données :** Persistance sécurisée des réponses et protection contre la duplication via l'infrastructure Supabase.

---

## Spécifications Techniques

| Composant | Technologie |
| :--- | :--- |
| **Framework UI** | React 18 |
| **Outils de Build** | Vite |
| **Styles** | Tailwind CSS 4.0 |
| **Animations** | Framer Motion |
| **Backend / DB** | Supabase (PostgreSQL) |
| **Iconographie** | Lucide React |

---

## Installation et Déploiement

### Environnement de Développement
```bash
# Installation des dépendances
npm install

# Lancement du serveur de développement
npm run dev
```

### Configuration des Services
Créez un fichier `.env` à la racine du projet avec les paramètres suivants :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme
```

### Structure de la Base de Données
Le schéma SQL nécessaire au fonctionnement de l'application est disponible dans le fichier `database_fix.sql`.

---

## Licence

Ce projet est sous licence MIT. Pour plus d'informations, veuillez consulter le fichier LICENSE.

---

<div align="center">

**Développé par [Syntra](https://xsyntra.netlify.app/)**  
*Solutions digitales et design de haute précision*

</div>
