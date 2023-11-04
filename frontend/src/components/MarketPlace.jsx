
import pokemon from 'pokemontcgsdk'
import React, { useState, useEffect } from 'react';
import { getMarketPlaceCards } from '@/functions/functions';
pokemon.configure({ apiKey: '03afe08b-77c3-42b8-886d-638a60b66f37' });


const MarketPlace = ({wallet}) => {
    const [MarketPlaceCards, setMarketPlaceCards] = useState([])
    
    useEffect(() => {
       async function  fetchMarketPlaceCards() {
        const cards = await getMarketPlaceCards(wallet);
        console.log(cards)
      
      //   const keyList = [];
    
      //   cardsList.forEach(card => {
      //     const cardKeys = [...card.keys()];
      //     keyList.push(cardKeys[0]);
      //   });
    
      //   setMarketPlaceCards(keyList);
       }
    
      fetchMarketPlaceCards();
      // console.log(MarketPlaceCards)
    }, []);
    

 
    
  return (
    <div>MarketPlace</div>
  )
}

export default MarketPlace