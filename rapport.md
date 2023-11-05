# BackEnd

Pour le backend nous avons choisi d'opter pour une architecture basée sur un super admin qui gère les evements de la blockchain.
Lorsque d'un evenement nécessitant une action de création ou d'echange de carte, le super admin va appeler les fonctions du smart contract.
Par concéquent il n'y aucune communication directe entre le front et le backend.

Plus tard, dans le développement de l'application, nous sommes arrivés à la conclusion que cette architecture n'était pas la plus adaptée, est qu'il était possible de rempalcer le super admin par un smart contract ayant la même fonction que le super admin  n'ayant pas eu le temps de mettre en place cette solution, nous avons décidé de garder cette architecture.

## Blockchain

### NFT

Notre application est entièrement basée sur un smart contract appelé `Collection.sol` qui permet de représenter un set de carte. 
Pour son implèmentation nous avons utilisé la librairie `openzeppelin` qui permet de créer des smart contract plus facilement et de manière plus sécurisée.

La création d'une collection est opérée par le super admin. La fonction `createCollection` du smart contract est utilisée avec les informations du set de carte.

Afin de stocker un minimum d'information sur la blockchain, et limiter l'utilisation de gas.
Nous avons choisi de stocker seulement les identifiants des cartes dans le smart contract.
Récupérer les informations supplémentaires nécessite donc de faire appel a une API externe en l'occurence [Pokémon TCG](https://pokemontcg.io/) opération délguée au frontend

De plus, toujours dans l'optique de stocker le minimum d'information sur la blockchain, seules les cartes possédées par les utilisateurs sont stockées dans le smart contract.

Donc afin de pourvoir créer des cartes, nous avons décidé de mettre en place un système de booster.

### Booster


La mise en place de booster souleve 1 problème majeur :
- Comment générée une donnée et de manière non previsible dans un système détérministe et dont un attaquant extérieur a une connaissance totale du système.

La solution qui nous est venu à l'esprit est d'utiliser un oracle qui va générer une donnée aléatoire hors du systeme cette donnée sera alors utilisée pour générer les cartes.
N'ayant pas les moyens financiers permettant de mettre en place cette solution, nous avons dû nous tourner vers une autre solution qui a pour but d'exemple.

On peut imaginer un système de génération aléatoire 
En se basant sur 3 données :
- Le hash du dernier bloc miné lors de l'ouverture du booster
- Le timestamp de l'ouverture du booster
- La difficulté du réseau lors de l'ouverture du booster
Ces données sont publiques et peuvent être vérifiées par n'importe qui mais elle sont difficilement prédictibles par un utilisateur sur un réseau important a l'instant de l'ouverture du booster.

Par contre ces 3 données sont identiques tout au long du processus d'ouverture du booster, il n'est donc pas possible de générer plusieurs cartes aléatoirement en une seule fois.
Afin de limiter la consomation de gas, nous avons d'implémenter un génerateur pseudo-aléatoire très connu le [Mersenne Twister](https://fr.wikipedia.org/wiki/Mersenne_Twister).

Une fois notre méthode choisie, nous avons décidé de mettre en place le système de booster, qui est le suivant :

Un booster dans notre application est une cryptomonnaie basée sur le stnadard ERC20,
Cette monnaie peut être acheté par un utilisateur contre de l'ether et permet de lancer une ouverture de booster.

L'operation d'ouverture de booster est la suivante :
1. L'utilisateur appelle la fonction `openBooster` de `Collection.sol`.
2. Le smart contract va alors verifier que l'utilisateur possède au moins un booster.
3. Si c'est le cas, le smart contract va alors appeler la fonction `openBooster` de `Booster.sol`.
4. N carte sont alors générées aléatoirement et envoyées au super admin.
5. Le super admin va alors attribuer les cartes à l'utilisateur.


### MarketPlace

Dans l'optique de permettre aux utilisateurs d'échanger leurs cartes, nous avons mis en place un système de transaction.

Une des difficultés de la mise en place d'un tel système est de permettre aux utilisateurs d'échanger leurs cartes entre les differentes collections, de manière sécurisée et asynchrone.

Il était donc nécessaire de mettre en place un système gloal de transaction.
On opte pour un système de transaction basé sur un smart contract `MarketPlace.sol` qui va permettre de mettre en relation les utilisateurs souhaitant échanger leurs cartes.

Le fonctionnement de ce smart contract est le suivant :
1. Un utilisateur appelle la fonction `sellCard` en précisant la carte qu'il souhaite vendre et les cartes qu'il souhaite obtenir en échange.
2. Un autre utilisateur appelle la fonction `buyCard` en précisant la carte qu'il souhaite acheter et la carte qu'il souhaite vendre en échange.
3. Le smart contract va alors vérifier que les cartes sont bien disponibles et que les utilisateurs possèdent bien les cartes qu'ils souhaitent échanger.
4. Si c'est le cas, le super admin va alors attribuer les cartes aux utilisateurs.

