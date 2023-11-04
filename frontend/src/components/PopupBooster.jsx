import React, { useEffect, useState } from 'react'
import './PopupBooster.css';
import { openPack, getSetMap } from '../functions/functions'

const PopupBooster = ({ isVisible, onClose, children, set, wallet }) => {
  const [boosterCard, setBoosterCards] = useState([]);
  useEffect(() => {
    async function fetchBoosterCard() {
      const myMap = await getSetMap(wallet);
      console.log(myMap)

    //   let id = ''
    //   for (const name in myMap.keys()) {
    //     if (name === set.name) {
    //       id = myMap.get(name)
    //     }
    //   }
    //   const cards = openPack(wallet, id);
    //   setBoosterCards(cards)

     }

    fetchBoosterCard();
   

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