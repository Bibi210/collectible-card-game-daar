import React, { useState, useEffect } from 'react';
import pokemon from 'pokemontcgsdk'
import './Booster.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import PopupBooster from './PopupBooster';
import { getAvalibleSet } from '@/functions/functions';

pokemon.configure({ apiKey: '03afe08b-77c3-42b8-886d-638a60b66f37' });


const Booster = ({ wallet }) => {
  const [pokemonSets, setPokemonSets] = useState([]);
  const [selectedSets, setSelectedSets] = useState([]);
  useEffect(() => {
    async function getAllSets() {
      try {
        const sets = await pokemon.set.where({ pageSize: 250, page: 1 });
        const avalibleSets = await getAvalibleSet(wallet);
        sets.data = sets.data.filter((set) => avalibleSets.includes(set.id));
        setPokemonSets(sets.data);
      } catch (error) {
        console.error('Error fetching sets:', error);
      }
    }

    getAllSets();
  }, []);

  const [boosterPopups, setBoosterPopups] = useState(pokemonSets.map(() => false));

  const showPopup = (setIndex) => {
    setSelectedSets(pokemonSets[setIndex]);
    // Set the corresponding card's popup to true
    const newBoosterPopups = [...boosterPopups];
    newBoosterPopups[setIndex] = true;
    setBoosterPopups(newBoosterPopups);
  };

  const hidePopup = () => {
    setSelectedSets(null);
    // Close all card popups
    setBoosterPopups(boosterPopups.map(() => false));
  };
  return (

    <div className="page-wrapper">
      <h1 className="title">Boosters</h1>
      <h2> Choose a collection, Open a booster and Discover your cards !</h2>
      <div className="sets-container" id="pokemonCards">
        {pokemonSets.map((Set, index) => (
          <><Card className="setCard" sx={{ maxWidth: 345 }} >
            <CardActionArea onClick={() => showPopup(index)}>
              <PopupBooster isVisible={boosterPopups[index]} onClose={hidePopup} set={Set} wallet={wallet} >
                {/* Additional content for the popup */}
              </PopupBooster>
              <CardMedia className='cardImg'
                component="img"
                height="140"
                image={Set.images.logo}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {Set.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Buy a  {Set.name} booster and discover the cards.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card></>
        ))}
      </div>
    </div>



  );



}

export default Booster;