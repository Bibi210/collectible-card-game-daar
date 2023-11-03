import React, { useEffect } from 'react'
import './PopupBooster.css';
import { openPack } from '../functions/functions'

const PopupBooster = ({ isVisible, onClose, children, set , wallet }) => {

    useEffect(() => {
        
      openPack(wallet,set.id)
       
          
        
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