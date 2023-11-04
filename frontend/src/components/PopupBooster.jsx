import React, { useEffect, useState } from 'react';
import './PopupBooster.css';

import pokemon from 'pokemontcgsdk';
pokemon.configure({ apiKey: '03afe08b-77c3-42b8-886d-638a60b66f37' });

const PopupBooster = ({ isVisible, onClose, set, booster }) => {
  


  return isVisible && (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button-booster" onClick={onClose}>Close</button>
        <div className="popup-content">
          <h2 className='Booster-title'>{set.name} Booster</h2>
          <div className="grid-container-booster" id="pokemonCards">
            {booster !== null ? (
              booster.map((card, index) => (
                <div key={index} className="card-container">
                  <img src={card.images.small} alt={card.name} />
                
                </div>
              ))
            ) : (
              <p>No cards in the booster.</p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
  
  
};

export default PopupBooster;
