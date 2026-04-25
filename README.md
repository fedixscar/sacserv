# Plateforme de Sondage Café Sacré Cœur

<div align="center">

![État du Projet](https://img.shields.io/badge/Statut-D%C3%A9ploy%C3%A9-success?style=flat-square&logo=netlify&logoColor=white)
![Environnement](https://img.shields.io/badge/Environnement-Production-blue?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-React%2018%20%2B%20Vite-blue?style=flat-square&logo=react&logoColor=white)
![Base de Données](https://img.shields.io/badge/Base%20de%20Donn%C3%A9es-Supabase-green?style=flat-square&logo=supabase&logoColor=white)

</div>

## Présentation du Projet

Ce projet constitue la solution technologique de sondage client pour l'établissement **Café Sacré Cœur**. L'application a été conçue pour recueillir des données analytiques précises concernant l'intérêt des clients pour de nouveaux services communautaires, tout en offrant une expérience utilisateur de haut niveau technique et esthétique.

La plateforme se distingue par une approche centrée sur l'engagement, utilisant des principes de design psychologique pour maximiser le taux de complétion des questionnaires.

## Caractéristiques Techniques et Design

### Architecture Mobile-First
Compte tenu des habitudes de consommation, l'interface a été optimisée pour une utilisation sur smartphones (90% du trafic cible). Cela inclut :
- Des zones de contact tactile élargies pour une navigation sans friction.
- L'utilisation de `dvh` (Dynamic Viewport Units) pour garantir une adaptation parfaite sur tous les navigateurs mobiles.
- Une gestion rigoureuse des zones de sécurité (Safe Areas) pour les terminaux iOS et Android récents.

### Système de Design "Artisanal"
L'identité visuelle repose sur une charte graphique premium évoquant l'univers du café haut de gamme :
- **Palette chromatique :** Combinaison de tons Espresso (#271310), Cream (#FEFCCF) et Gold (#735C00).
- **Typographie :** Utilisation de Playfair Display pour les titres (élégance) et Inter pour le corps de texte (lisibilité).
- **Composants :** Développement de composants UI personnalisés sans dépendance à des bibliothèques de composants génériques pour un contrôle total de l'esthétique.

### Orchestration des Animations
L'expérience immersive est portée par Framer Motion :
- **Transitions de pages :** Effets de glissement horizontal (swipe-like) mimant le comportement des applications mobiles natives.
- **Micro-interactions :** Animations de retour haptique visuel sur les sélections et les boutons de validation.
- **Éléments dynamiques :** Système de particules (confettis) et icônes vectorielles animées (Pièce Fidélité) pour la valorisation du parcours utilisateur.

## Architecture des Données

### Infrastructure Backend
La solution s'appuie sur l'écosystème Supabase pour une gestion temps réel des données :
- **Persistance :** Stockage structuré des réponses dans une base PostgreSQL.
- **Sécurité :** Mise en œuvre de politiques de sécurité au niveau des lignes (RLS) pour protéger l'intégrité des données.
- **Validation :** Filtrage des domaines d'emails jetables et vérification de l'unicité des soumissions.

### Système de Parrainage
Un algorithme de parrainage intégré permet de générer des liens uniques par utilisateur, facilitant la croissance organique du sondage et le suivi des récompenses de fidélité.

## Spécifications de la Stack Technique

- **Interface :** React 18 avec TypeScript pour une robustesse accrue.
- **Tooling :** Vite pour des performances de développement et de build optimales.
- **Styling :** Tailwind CSS 4.0 pour un système de design atomique et performant.
- **Iconographie :** Lucide React (vecteurs légers et modifiables).

## Guide de Déploiement

### Prérequis
- Node.js (Version LTS recommandée)
- Un projet Supabase configuré

### Configuration Locale
1. Clonez le dépôt.
2. Installez les dépendances : `npm install`.
3. Configurez les variables d'environnement dans un fichier `.env` :
   ```env
   VITE_SUPABASE_URL=votre_url_instance
   VITE_SUPABASE_ANON_KEY=votre_cle_api_publique
   ```
4. Exécutez le script SQL présent dans `database_fix.sql` dans votre éditeur SQL Supabase.
5. Lancez le serveur : `npm run dev`.

### Déploiement Production
L'application est configurée pour un déploiement continu sur Netlify. Le fichier `netlify.toml` gère les redirections nécessaires pour le routage Single Page Application (SPA).

---

## Propriété et Maintenance

Ce projet est la propriété intellectuelle de **Syntra**.

**Développement et Design par :**
[Syntra - Agence Digitale Premium](https://xsyntra.netlify.app/)
