
import pokemon from 'pokemontcgsdk'
import React, { useState, useEffect } from 'react';
import { getMarketPlaceCards , getUserCards } from '@/functions/functions';

import './MarketPlace.css';
pokemon.configure({ apiKey: '03afe08b-77c3-42b8-886d-638a60b66f37' });


const MarketPlace = ({ wallet }) => {
  const [MarketPlaceCards, setMarketPlaceCards] = useState(null)
  const [MarketPlaceMap, setMarketPlaceMap] = useState(null)
  const [UserCards, setUserCards] = useState(null)
  useEffect(() => {
    async function fetchMarketPlaceCards() {
      try {
        const cards = await getMarketPlaceCards(wallet);
        console.log(cards);


        const idList = cards.map(c => pokemon.card.find(c.uri));
        const cardList = await Promise.all(idList);
        console.log(cardList);

        setMarketPlaceCards(cardList);
      } catch (error) {
        console.error("Error fetching market cards:", error);
      }
    }

    async function fetchUserCards() {
      try {
        const cards = await getUserCards(wallet);
        setUserCards(cards);
      } catch (error) {
        console.error("Error fetching market cards:", error);
      }
    }

    fetchUserCards()
    fetchMarketPlaceCards();
    console.log(MarketPlaceCards)
    console.log(UserCards)

    async function fetchAcceptedCards() {
      const cards = await getMarketPlaceCards(wallet);
      const CardsMap = new Map();

      // Fetch currency images for each card
      for (const card of cards) {
        const currencycards = [];
        for (const currencyURI of card.acceptedCurrencies) {
          pokemon.card.find(currencyURI)
            .then(card => {
              currencycards.push(card)
            })
          CardsMap.set(card.uri, currencycards)
        }


      }
      console.log(CardsMap)
      setMarketPlaceMap(CardsMap)

    }

    fetchAcceptedCards()

  }, [wallet]);

  const [selectedCard, setSelectedCard] = useState(null);
  const openPopup = (card) => {
    setSelectedCard(card);
  };

  const closePopup = () => {
    setSelectedCard(null);
  };


  return (
    <div className="page-wrapper">
      <h1 className="title">MarketPlace</h1>
      <div className="grid-container" id="MyPokemonCards">
        {MarketPlaceCards !== null ? (
          MarketPlaceCards.map((card, index) => (
            <div key={index} className="card-container" onClick={() => openPopup(card)}>
              <img src={card.images.small} alt={card.name} />
            </div>
          ))
        ) : (
          <p>No cards in the marketplace.</p>
        )}
      </div>
      {selectedCard && (
        <div className="popup-overlay">
          <div className="popupMarketPlace">
          <button className="close-button-marketplace" onClick={closePopup}>Close</button>
          <button className='exchange' >Exchange card</button>
            <img className= "Marketplace-popupImg" src={selectedCard.images.small} />
            {
  [...MarketPlaceMap.keys()].map(key => {
    if (key == selectedCard.id) {
      return (
        <div className="acceptedCards" >
          <h2>Accepted Cards</h2>
        <div className="grid-container-marketplace" id="MyPokemonCards" key={key}>
          {MarketPlaceMap.get(key).map((card, index) => (
            <div key={index} className="card-container-marketplace">
              <img className="AcceptedCard-img" src={card.images.small} alt="Pokemon Card" />{

              }
            </div>
          ))}
        </div>
        </div>
      );
    }
    return null; // Vous pouvez ajouter cette ligne pour éviter les erreurs.
  })
}

            
          </div>
        </div>
      )}
    </div>



  )
}

export default MarketPlace