
import currentAccount from './Home'
import { useWallet } from '../App'
import pokemon from 'pokemontcgsdk'
import { getUserCards } from '../functions/functions'
import './profile.css';
import React, { useState, useEffect } from 'react';
import Popup from './Popup';


pokemon.configure({ apiKey: '03afe08b-77c3-42b8-886d-638a60b66f37' });

const Profile = () => {
  const [myCards, setMyCards] = useState([]);
  const wallet = useWallet();
  console.log(wallet)
  useEffect(() => {


    async function fetchUserCards() {
      const cards = await getUserCards(wallet)
      _cards.push(...cards);
      const cardPromises = cards.map((cardId) =>
        pokemon.card.find(cardId).then((card) => card)
      );

      Promise.all(cardPromises)
        .then((userCards) => {
          setMyCards(userCards);
        })
        .catch((error) => {
          console.error('Error fetching user cards:', error);
        });
    }

    fetchUserCards();
  }, []);
  const _cards = [];

  // Maintain an array of booleans to track the visibility of each card's popup
  const [cardPopups, setCardPopups] = useState(_cards.map(() => false));



  const showPopup = (cardIndex) => {
    setSelectedCard(myCards[cardIndex]);
    // Set the corresponding card's popup to true
    const newCardPopups = [...cardPopups];
    newCardPopups[cardIndex] = true;
    setCardPopups(newCardPopups);
  };

  const hidePopup = () => {
    setSelectedCard(null);
    // Close all card popups
    setCardPopups(cardPopups.map(() => false));
  };

  return (
    <div className="page-wrapper">
      <h1 className="title">My cards</h1>
      <div className="grid-container" id="MyPokemonCards">
        {myCards.map((card, index) => (
          <div key={index} className="card-container">
            <img src={card.images.small} alt="Pokemon Card" onClick={() => showPopup(index)} />
            <Popup isVisible={cardPopups[index]} onClose={hidePopup} card={card} >
              {/* Additional content for the popup */}
            </Popup>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
