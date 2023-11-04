import React, { useEffect, useState } from 'react';
import './PopupBooster.css';
import { openPack } from '../functions/functions';

const PopupBooster = ({ isVisible, onClose, set, wallet }) => {
  const [lastBooster, setLastBooster] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenPack = async () => {
    try {
      setIsLoading(true);
      const result = await openPack(wallet, set.id);
      setLastBooster(result);
      console.log('Last booster:', result);
  
      // Assuming that result contains an array of cards, you can log the cards
      result.cards.forEach((card, index) => {
        console.log(`Card ${index + 1}:`, card);
      });
  
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
      console.error('Error opening the booster pack:', err);
    }
  };

  useEffect(() => {
    if (isVisible) {
      handleOpenPack();
      
    }
  }, [isVisible]);

  return isVisible && (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button" onClick={onClose}>Close</button>
        <div className="popup-content">
          <h2>{set.name} Booster</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error.message}</p>
          ) : (
            <>
              <p>Opened booster: {lastBooster}</p>
              {/* Add any other content you want to display here */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupBooster;
