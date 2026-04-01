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

### 3. Remplacer les mots de passes en clair dans la base par un hash

Pour cela, j'ai effacé tous les utilisateurs de la base de données, puis je les ai recréés en veillant à ce que la création de compte fonctionne et que le hachage soit correct.

### 4. Ajouter un sel

Ceci a été fait pendant l'étape précédente, car j'ai utilisé argon2.

### 5. Ajouter un poivre

Cela a été simple, car j'ai seulement eu besoin de mettre "+ PEPPER" (PEPPER ici étant la valeur du .env) à chaque fois qu'AuthController utilisait "password"

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

### 11. Limiter la durée du token JWT actuel et implémenter un refresh token pour rester connecté sur une longue période

Ceci a été fait en créant un token nommé "refreshToken" et fait en sorte qu'il dure 7 jours comparé au "token", qui dure maintenant 15 minutes. Après cela, il fallait simplement faire en sorte qu'il puisse se refresh en créant une fonction qui s'appelle avec "/api/auth/refresh"  
Cela m'a pris du temps, car je voulais essayer voir si ça marchait avec bruno (j'ai eu quelques soucis avec les cookies) et ai remarqué qu'il me manquait le package "cookie-parser".

## Activitées Moyennes

## Activitées Difficiles

## Conclusion
