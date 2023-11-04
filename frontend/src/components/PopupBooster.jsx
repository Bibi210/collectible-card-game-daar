import React, { useEffect, useState } from 'react'
import './PopupBooster.css';
import { openPack, getAvalibleSet } from '../functions/functions'

const PopupBooster = ({ isVisible, onClose, children, set, wallet }) => {
  const [boosterCard, setBoosterCards] = useState([]);
  useEffect(() => {
    async function fetchBoosterCard() {
      const SetList = await getAvalibleSet (wallet);
      console.log(SetList)
      console.log(set.id)
     const cards = await openPack(wallet, set.id);
     console.log(cards)
    //  setBoosterCards(cards)

     }

     fetchBoosterCard();
    // console.log(boosterCard)

  }, [])
  return (


    isVisible && (
      <div className="popup-overlay">
        <div className="popup">


          <button className="close-button" onClick={onClose}>Close</button>


        </div>
      </div>)
  )
}

export default PopupBooster