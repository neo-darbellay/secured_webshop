# Rapport P_App I183 Néo Darbellay

## Description du projet

Dans ce projet, nous devons sécuriser une application de magasin en ligne qui tourne sur Node.JS.  
Pour cela, nous avons reçu le code source du WebShop et devons le modifier en implémentant des "étapes", sous forme d'activités données au préalable.  
En plus de ces étapes, nous devons atteindre un total de 15 points (ou plus) pour valider le projet.  
Ces activités sont réparties comme suit :

| Activitée    | Point(s) par tâche | Total de tâches dans l'activitée |
| ------------ | ------------------ | -------------------------------- |
| Obligatoires | 1                  | 8                                |
| Faciles      | 1                  | 6                                |
| Moyennes     | 2                  | 6                                |
| Difficiles   | 3                  | 5                                |

Les prochains chapitres serviront à expliquer chaque étape de la réalisation de ce projet et la dernière sera une conclusion aussi bien du projet qu'une personelle.

## Activitées Obligatoires

### 1. Implémenter une page de login en frontend

Pour cette étape, j'ai simplement ajouté un lien vers la page login.html, ajouté du css, créé un formulaire de connexion, puis relié ce dernier à une fonction qui envoie une requête à l'API (avec un fetch) de l'application.  
Celle-ci redirige ensuite l'utilisateur vers la page d'accueil si l'authentification a réussi.

### 2. Implémenter une page d'inscription en frontend

La procédure de cette étape s'est déroulée comme la précédente, à la différence que j'ai déplacé les fonctions dans un fichier JavaScript utilisé par les deux pages.
J'ai du retourner sur ce point plus tard, car j'ai oublié de mettre les champs adresse et photo de profil

### 3. Remplacer les mots de passes en clair dans la base par un hash

Pour cela, j'ai effacé tous les utilisateurs de la base de données, puis je les ai recréés en veillant à ce que la création de compte fonctionne et que le hachage soit correct.

### 4. Ajouter un sel

Ceci a été fait pendant l'étape précédente, car j'ai utilisé argon2.

### 5. Ajouter un poivre

Cela a été simple, car j'ai seulement eu besoin de mettre "+ PEPPER" (PEPPER ici étant la valeur du .env) à chaque fois qu'AuthController utilisait `password`

### 6. Corriger les requêtes existantes afin de prévenir l'injection SQL

Cette étape consistait à modifier les requêtes SQL à l'aide de "Query Builder", afin d'empêcher les injections SQL  
Cela a été simple, car j'avais déjà vu un exemple de Query Builder dans un exercice précédent et j'ai su le recréer

### 7. Implémenter l'utilisation d'un token JWT

Pour cela, j'ai créé un jeton JWT contenant l'identifiant utilisateur, le rôle et le nom d'utilisateur (pour pouvoir modifier l'en-tête) et j'ai fait en sorte que chaque route nécessaire utilise le middleware  
Ça m'a pris du temps, car j'ai fait une partie pendant un cours et l'autre le cours d'après, sans me rappeler comment fonctionnaient les tokens JWT

### 8. Ajouter les rôles administrateur et utilisateur dans le JWT et protéger les routes d'administration

Ceci a été fait en vérifiant que le rôle de l'utilisateur actuel == 'admin'  
Cela ne m'a pas pris autant de temps, car j'ai décidé de l'implémenter en même temps que le point précédent

## Activitées Faciles

### 9. Mettre en place le HTTPS

Pour faire cela, j'ai créé un nouveau certificat SSL, et utilisé HTTPS pour créer un serveur  
Cela ne m'a pas pris beaucoup de temps, car j'avais déjà configuré mon propre serveur HTTPS

### 10. Mettre en place une politique de mot de passe fort (minuscules, majuscule, longueur minimale, caractères spéciaux) avec l'affichage d'un indicateur de force

Pour faire cela, j'ai utilisé "Joi", pour pouvoir vérifier toutes le nom, email et mot de passe de l'utilisateur, ainsi que du RegEx pour vérifier la force du mot de passe  
Cela m'a pris du temps, car j'ai rencontré un soucis d'affichage de mot de passe

### 11. Limiter la durée du token JWT actuel et implémenter un refresh token pour rester connecté sur une longue période

Ceci a été fait en créant un token nommé `refreshToken` et fait en sorte qu'il dure 7 jours comparé au `token`, qui dure maintenant 15 minutes. Après cela, il fallait simplement faire en sorte qu'il puisse se refresh en créant une fonction qui s'appelle avec `/api/auth/refresh`  
Cela m'a pris du temps, car je voulais essayer voir si ça marchait avec bruno (j'ai eu quelques soucis avec les cookies) et ai remarqué qu'il me manquait le package `cookie-parser`.

### 12. Effectuer un audit des dépendances NPM, corriger et documenter la correction

Pour ce faire, j'ai tout d'abord fait la commande `npm audit`, analysé les soucis et les ai documentés, puis ai lancé `npm audit fix` pour réparer les soucis  
Cela m'a pris un peu de temps pour comprendre les vulnérabilités et les traduire en français

#### Problèmes de vulnérabilités

Voici, en grande lignes, les soucis de l'audit

- body-parser était vulnérable aux attaques DOS
- brace-expansion aussi
- braces avait une consomption de données non controllé
- cookie avait une mauvaise gestion des données, qui pouvait causer des soucis
- minimatch était vulnérable aux attaques ReDOS, un type de DOS causé par les Regular Expression
- path-to-regexp aussi
- picomatch avait une erreur de Regular Expression qui faisait que les attaquers pouvaient insérer des noms de méthodes et elles s'éxécuteraient
- qs était vulnérable au DOS à plusieurs points
- send avait une vulnérabilité qui pouvait causer du XSS

### 13. Vérifier la résistance de vos hash avec l'outil John The Ripper et aux rainbow tables, via un export de la BDD

Pour faire ceci, j'ai utilisé une ancienne VM Ubuntu, qui devait bien sûr recevoir plusieurs MAJ avant que je puisse faire quoi que ce soit, pour installer John The Ripper, mais cela n'était que le début de mes soucis.  
John The Ripper par lui même ne supporte pas les mot de passes encodé en Argon2, et j'ai dû installer john-jumbo pour que cela marche (ça m'a pris du temps pour comprendre cela)  
A part cela, j'ai vu qu'il n'a pas déchiffré mes mot de passes de la DB grace au sel et poivre.
Cela m'a pris du temps pour les raisons cités ci-dessus

## Activitées Moyennes

## Activitées Difficiles

## Conclusion
