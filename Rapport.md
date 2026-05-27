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
J'ai du retourner sur ce point plus tard, car j'ai oublié de mettre les champs adresse et photo de profil.

### 3. Remplacer les mots de passes en clair dans la base par un hash

Pour cela, j'ai effacé tous les utilisateurs de la base de données, puis je les ai recréés en veillant à ce que la création de compte fonctionne et que le hachage soit correct.

### 4. Ajouter un sel

Ceci a été fait pendant l'étape précédente, car j'ai utilisé argon2.

### 5. Ajouter un poivre

Cela a été simple, car j'ai seulement eu besoin de mettre "+ PEPPER" (PEPPER ici étant la valeur du .env) à chaque fois qu'AuthController utilisait `password`.

### 6. Corriger les requêtes existantes afin de prévenir l'injection SQL

Cette étape consistait à modifier les requêtes SQL à l'aide de "Query Builder", afin d'empêcher les injections SQL.  
Cela a été simple, car j'avais déjà vu un exemple de Query Builder dans un exercice précédent et j'ai su le recréer.

### 7. Implémenter l'utilisation d'un token JWT

Pour cela, j'ai créé un jeton JWT contenant l'identifiant utilisateur, le rôle et le nom d'utilisateur (pour pouvoir modifier l'en-tête) et j'ai fait en sorte que chaque route nécessaire utilise le middleware.  
Ça m'a pris du temps, car j'ai fait une partie pendant un cours et l'autre le cours d'après, sans me rappeler comment fonctionnaient les tokens JWT.

### 8. Ajouter les rôles administrateur et utilisateur dans le JWT et protéger les routes d'administration

Ceci a été fait en vérifiant que le rôle de l'utilisateur actuel == 'admin'.  
Cela ne m'a pas pris autant de temps, car j'ai décidé de l'implémenter en même temps que le point précédent.

## Activitées Faciles

### 9. Mettre en place le HTTPS

Pour faire cela, j'ai créé un nouveau certificat SSL, et utilisé HTTPS pour créer un serveur.  
Cela ne m'a pas pris beaucoup de temps, car j'avais déjà configuré mon propre serveur HTTPS.

### 10. Mettre en place une politique de mot de passe fort (minuscules, majuscule, longueur minimale, caractères spéciaux) avec l'affichage d'un indicateur de force

Pour faire cela, j'ai utilisé "Joi", pour pouvoir vérifier toutes le nom, email et mot de passe de l'utilisateur, ainsi que du RegEx pour vérifier la force du mot de passe.  
Cela m'a pris du temps, car j'ai rencontré un soucis d'affichage de mot de passe.

### 11. Limiter la durée du token JWT actuel et implémenter un refresh token pour rester connecté sur une longue période

Ceci a été fait en créant un token nommé `refreshToken` et fait en sorte qu'il dure 7 jours comparé au `token`, qui dure maintenant 15 minutes. Après cela, il fallait simplement faire en sorte qu'il puisse se refresh en créant une fonction qui s'appelle avec `/api/auth/refresh`.  
Cela m'a pris du temps, car je voulais essayer voir si ça marchait avec bruno (j'ai eu quelques soucis avec les cookies) et ai remarqué qu'il me manquait le package `cookie-parser`.

### 12. Effectuer un audit des dépendances NPM, corriger et documenter la correction

Pour ce faire, j'ai tout d'abord fait la commande `npm audit`, analysé les soucis et les ai documentés, puis ai lancé `npm audit fix` pour réparer les soucis.  
Cela m'a pris un peu de temps pour comprendre les vulnérabilités et les traduire en français.

#### Problèmes de vulnérabilités

Voici, en grande lignes, les soucis de l'audit :

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
John The Ripper par lui même ne supporte pas les mot de passes encodé en Argon2, et j'ai dû installer john-jumbo pour que cela marche (ça m'a pris du temps pour comprendre cela).  
À part cela, j'ai vu qu'il n'a pas déchiffré mes mot de passes de la DB grace au sel et poivre.  
Cela m'a pris du temps pour les raisons cités ci-dessus.

### 14. Gérer les exceptions afin de ne pas retourner trop d'information en cas d'erreur

Ceci était assez simple, il m'a fallut rechercher toutes les exceptions, logger les erreurs sur le serveur au lieu du client et renvoyer une erreur compréhensible au client.

## Activitées Moyennes

### 15. Limiter le nombre de tentatives de login (example : 5 essai / minute / IP) pour contrer le brute-force

Pour faire cela, j'ai installé le package `express-rate-limit`, puis je l'ai setup pour la route "login".

### 16. Implémenter un verrouillage de compte après N tentatives de connexion échouées, enregistrer les tentatives en BDD et prévoir un mécanisme de déblocage

Pour ce point, j'ai repris le système de tentative de login et fait en sorte que chaque connexion échouées incrémentait les "attempts" de 1 (ce nombre se met à 0 après) et si "attempts" est à 5, on vérifie quand était lee dernier essai, et si cela ne fait pas 15 minutes (ou plus), on bloque le compte et personne ne peut y accéder.  
Le serveur MySQL m'a causé quelques soucis avec les dates, car la timezone n'était pas la bonne et cela m'a pris du temps pour comprendre le soucis.

### 18. Chiffrement des données sensibles (addresse, etc.) dans la base

C'était assez simple à réaliser, j'ai converti le champ adresse de VARCHAR en VARBINARY, puis utiliser AES_ENCRYPT pour l'upload, et AES_DECRYPT (en plus de conversion en string) pour récupérer les données.  
Cela m'a pris du temps, car au début, j'ai utilisé une variable de session et fait en sorte que la table sql, en utilisant un TRIGGER encryptait par défaut les données, mais j'ai remarqué quelques soucis avec cette logique, et ai à la place modifié les requêtes.

### 19. Protection XSS: identifier une faille XSS dans l'application et faire en sorte de la corriger

Voici les failles que j'ai trouvé, une briève explication ainsi que leur corrections respectives :

| Faille                                                          | Explication                                                  | Correction                                   |
| :-------------------------------------------------------------- | :----------------------------------------------------------- | :------------------------------------------- |
| Chemin de photo de profil vulnérable depuis le backend          | Modification de `photo_path` sur le backend n'était pas safe | Création de l'image hors de l'innerHTML      |
| Le username n'a pas de validation, et XSS possible via la nav   | l'utilisateur peut avoir un username de n'importe quoi       | Modification vérification username et nav    |
| Route admin vulnérable à cause de la structure de la table user | La table user utilisait innerHtml uniquement                 | Modification du code de création de la table |

### 20. Mettre en place un principe de moindre privilège sur la BDD, créer un utilisateur spécifique qui sera employé par les scripts

J'ai réalisé ceci en ajoutant in fichier init.sh à l'intérieur de app/db/init et fait en sorte que le docker-compose.yml a accès au fichier .env de l'application, pour créer le compte.  
Au début, j'ai aussi voulu changer l'appel de la db de "mysql2" à "mysql2/promise", mais cela a fait plus de mal que de bien, donc j'ai abandonné cette idée.

## Activitées Difficiles

### 21. Implémenter une protection CSRF sur un formulaire du site

J'ai été "forcé" à faire cette activitée, car j'ai décidé de commencer l'activité 25, qui m'a demandé des tokens CSRF.
Pour cela, j'ai utilisé le module `csurf` et `express-session`.

### 25. Scanner l'application avec OWASP ZAP, récupérer le rapport de scan et corriger au moins 3 alertes

Tout d'abord, j'ai dû créer une VM Windows 11, lui mettre docker + node + visual studio code + cmder + OWASP ZAP, ce qui m'a pris du temps.  
Ensuite, j'ai réalisé que docker ne peut pas tourner sur une VM simple, donc j'ai du trouver un moyen de faire du "port forwarding" pour faire en sorte que le serveur tourne sur l'HOST et que la VM puisse avoir accès au serveur.

Voici la liste des alertes que ZAP m'a donné :
| Niveau de danger | Type                                              | Solution prise                                |
| :--------------- | :------------------------------------------------ | :-------------------------------------------- |
| Haute priorité   | SQL Injection                                     | Rien a faire, c'était une fausse alerte       |
| Moyenne priorité | Absence of Anti-CSRF Tokens (x2)                  | Pour cela, j'ai du faire l'étape 21           |
| Moyenne priorité | Content Security Policy (CSP) Header Not Set (x4) | J'ai ajouté un Content-Security-Policy header |

## Conclusion
