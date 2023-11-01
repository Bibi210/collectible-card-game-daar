import pokemon from 'pokemontcgsdk'

pokemon.configure({ apiKey: '03afe08b-77c3-42b8-886d-638a60b66f37' })

let user_cards = []
let user_map = new Map()
function f() {
    var privatekey = currentAccount;
    var cards = getUserCards(privatekey);
    for (var i =0 ; i< cards.length ; i++) {
        user_map.set(i,cards[i])
        
    }
     
    for (let key of user_map.keys()) {
        pokemon.card.find(user_map.get(key)).then(card => {
            console.log(card)
            if(!user_cards.some(e => e == key)){
                const pokemonCards = document.getElementById('MyPokemonCards');
                const cardContainer = document.createElement('div');
                cardContainer.classList.add('card-container');
                const cardImage = document.createElement('img');
                // Ajoutez l'URL de l'image à l'élément img
                cardImage.src = card.images.small;
                cardContainer.appendChild(cardImage);
                pokemonCards.appendChild(cardContainer);
                user_cards.push(key)
            }
        })
    }
    




};
document.querySelector("#showCardsButton").addEventListener('click', (e) => {
    f();
})