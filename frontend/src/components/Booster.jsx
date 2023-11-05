import React, { useState, useEffect } from 'react';
import pokemon from 'pokemontcgsdk'
import './Booster.css';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PopupBooster from './PopupBooster';
import { getAvalibleSet } from '@/functions/functions';
import { openPack } from '../functions/functions';

pokemon.configure({ apiKey: '2656b87d-c120-4542-b23b-f98c7e1df25a' });



const Booster = ({ wallet }) => {
  const [pokemonSets, setPokemonSets] = useState([]);
  const [selectedSets, setSelectedSets] = useState([]);
  useEffect(() => {
    async function getAllSets() {
      try {
        const avalibleSets = await getAvalibleSet(wallet);
        console.log(avalibleSets)
        const setPromises = avalibleSets.map(set => pokemon.set.find(set))
        const sets = await Promise.all(setPromises);
        console.log(sets)
        setPokemonSets(sets);

      } catch (error) {
        console.error('Error fetching sets:', error);
      }
    }

    getAllSets();
    console.log(pokemonSets)
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

  /*open pack */
  const [lastBooster, setLastBooster] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleOpenPack = async (set, index) => {
    try {
      console.log(set.id)
      setIsLoading(true);
      const result = await openPack(wallet, set.id);

      console.log('Last booster:', result);
      const BoosterPromises = result.map(id => pokemon.card.find(id))
      const booster = await Promise.all(BoosterPromises);
      console.log(booster)
      setLastBooster(booster);

      showPopup(index)


      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
      console.error('Error opening the booster pack:', err);
    }
  };
  useEffect(() => {

    handleOpenPack();
    console.log(lastBooster)


  }, []);
  /**************************** */







  return (

    <div className="page-wrapper">
      <h1 className="title">Boosters</h1>
      <h2> Choose a collection, Open a booster and Discover your cards !</h2>
      <div className="sets-container" id="pokemonCards">
        {pokemonSets.map((Set, index) => (
          <><Card className="setCard" sx={{ maxWidth: 345 }} >
            <PopupBooster isVisible={boosterPopups[index]} onClose={hidePopup} set={Set} booster={lastBooster} >
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
              <CardActions>

                <Button size="small" onClick={() => handleOpenPack(Set, index)}>Open booster</Button>



              </CardActions>
            </CardContent>

          </Card></>
        ))}
      </div>
    </div>



  );



}

export default Booster;