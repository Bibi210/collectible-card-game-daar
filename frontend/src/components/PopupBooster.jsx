import React, { useEffect , useState } from 'react'
import './PopupBooster.css';
import { openPack , getSetMap} from '../functions/functions'

const PopupBooster = ({ isVisible, onClose, children, set , wallet }) => {
  const [boosterCard, setBoosterCards] = useState([]);
    useEffect(() => {

      async function fetchBoosterCard() {
      const myMap =  await getSetMap(wallet) ;
      console.log(myMap)
      let id=''
      for (const key in myMap) {
        if ((myMap.get(key)) == set.name) {
         id = key
        }
      }
      const cards = openPack(wallet,id) ;
      setBoosterCards(cards)
      
      }
    
      fetchBoosterCard() ;
      console.log(boosterCard)
        
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