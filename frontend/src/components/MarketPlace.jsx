
import pokemon from 'pokemontcgsdk'
import React, { useState, useEffect } from 'react';
import { getMarketPlaceCards, getUserCards, buyFromMarketplace } from '@/functions/functions';

import './MarketPlace.css';
import { Checkbox } from '@mui/material';



const MarketPlace = ({ wallet }) => {
  const [MarketPlaceCards, setMarketPlaceCards] = useState(null)
  const [MarketPlaceMap, setMarketPlaceMap] = useState(null)
  const [SpotMap, setSpotMap] = useState(null)
  const [UserCards, setUserCards] = useState(null)

  useEffect(() => {



    async function fetchMarketPlaceCards() {
      try {
        const cards = await getMarketPlaceCards(wallet);


        const idList = cards.map(c => pokemon.card.find(c.uri));
        const cardList = await Promise.all(idList);

        setMarketPlaceCards(cardList);
      } catch (error) {
        console.error("Error fetching market cards:", error);
      }
    }

    async function fetchUserCards() {
      try {
        const cards = await getUserCards(wallet);
        console.log("User Owned : ", cards);
        setUserCards(cards);
      } catch (error) {
        console.error("Error fetching market cards:", error);
      }
    }

    fetchUserCards()
    fetchMarketPlaceCards();

    async function fetchAcceptedCards() {
      const cards = await getMarketPlaceCards(wallet);
      const CardsMap = new Map();
      const spotsMap = new Map();
      // Fetch currency images for each card
      for (const card of cards) {
        const currencycards = [];

        for (const currencyURI of card.acceptedCurrencies) {
          pokemon.card.find(currencyURI)
            .then(card => {
              currencycards.push(card)
            })
          CardsMap.set(card.uri, currencycards)
          spotsMap.set(card.uri, card)
        }


      }
      setMarketPlaceMap(CardsMap)
      setSpotMap(spotsMap)

      console.log("CardsMap : ", MarketPlaceCards);
      console.log("MarketPlaceMap : ", MarketPlaceMap);
      console.log("SpotsMap : ", spotsMap);


    }

    fetchAcceptedCards()




  }, [wallet]);

  function hasCard(id) {
    return UserCards.includes(id)
  }
  const [selectedCard, setSelectedCard] = useState(null);
  const openPopup = (card) => {
    setSelectedCard(card);
  };

  const closePopup = () => {
    setSelectedCard(null);
  };

  const [selectedCards, setSelectedCards] = useState([]);

  const handleCardSelect = (cardId) => {
    if (selectedCards.length < 1) {
      setSelectedCards([...selectedCards, cardId]);
    }
  };

  const handleCardDeselect = (cardId) => {
    setSelectedCards(selectedCards.filter((id) => id !== cardId));
  };


  return (
    <div className="page-wrapper">
      <h1 className="title">MarketPlace</h1>
      <div className="grid-container" id="MyPokemonCards">
        {MarketPlaceCards !== null ? (
          MarketPlaceCards.map((card, index) => (
            <div key={index} className="card-container" onClick={() => { console.log("Selected : ", card); openPopup(card) }}>
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
            <button className='exchange' variant="contained"
              onClick={() => buyFromMarketplace(wallet, SpotMap.get(selectedCard.id), selectedCards[0])} >Exchange card</button>
            <img className="Marketplace-popupImg" src={selectedCard.images.small} />
            {
              [...MarketPlaceMap.keys()].map(key => {
                if (key == selectedCard.id) {
                  return (
                    <div className="acceptedCards" >
                      <h2>Accepted Cards</h2>
                      <div className="grid-container-marketplace" id="MyPokemonCards" key={key}>
                        {MarketPlaceMap.get(key).map((card, index) => (
                          <div key={index} className="card-container-marketplace">
                            <img className="AcceptedCard-img" src={card.images.small} alt="Pokemon Card" />
                            {hasCard(card.id) &&
                              (selectedCards.includes(card.id) ? (
                                <Checkbox
                                  checked={true}
                                  onChange={() => handleCardDeselect(card.id)}
                                />
                              ) : (
                                <Checkbox
                                  checked={false}
                                  onChange={() => handleCardSelect(card.id)}
                                />
                              ))
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