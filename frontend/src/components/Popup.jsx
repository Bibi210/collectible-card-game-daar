import React, { useEffect, useState } from 'react';
import './Popup.css';
import TabContext from '@mui/lab/TabContext';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import TabList from '@mui/lab/TabList';
import pokemon from 'pokemontcgsdk';
import { Checkbox , Button } from '@mui/material';
import { addToMarketplace} from '../functions/functions'

pokemon.configure({ apiKey: '03afe08b-77c3-42b8-886d-638a60b66f37' });

function Popup({ isVisible, onClose, children, card }) {
  const [pokemonCards, setPokemonCards] = useState([]);
  const [pokemonSets, setPokemonSets] = useState([]);
  const [value, setValue] = React.useState('1');
  const [filter, setFilter] = useState('all');
  // Search menu state
  const [selectedSet, setSelectedSet] = useState('all');
  const [selectedCards, setSelectedCards] = useState([]);
  

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    async function getAllSets() {
      try {
        const sets = await pokemon.set.where({ pageSize: 50, page: 2 });
        setPokemonSets(sets.data);
      } catch (error) {
        console.error('Error fetching sets:', error);
      }
    }

    async function getAllCards() {
      try {
        const cards = await pokemon.card.where({ pageSize: 100 });
        setPokemonCards(cards.data);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    }

    getAllCards();
    getAllSets();
  }, []);

    const filteredCards = pokemonCards.filter((card) => {
    const isSetMatch = filter === 'all' || card.set.name === filter;
    return isSetMatch ;
  });

  const handleCardSelect = (cardId) => {
    if (selectedCards.length < 4) {
      setSelectedCards([...selectedCards, cardId]);
    }
  };

  const handleCardDeselect = (cardId) => {
    setSelectedCards(selectedCards.filter((id) => id !== cardId));
  };

  
  

  return (
    isVisible && (
      <div className="popup-overlay">
        <div className="popup">
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box className="box" csx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="Details" value="1" />
                  <Tab label="Exchange Card" value="2" />
                </TabList>
                <button className="close-button" onClick={onClose}>
                  Close
                </button>
              </Box>
              <TabPanel className="panel" value="1">
                <h2>{card.name}</h2>
                {children}
                <img src={card.images.small} />
              </TabPanel>
              <div className="panel2">
                <TabPanel className="panel" value="2">
                  <h2>{card.name}</h2>
                  {children}
                  <p className="exchange-para">
                    Select 1 to 4 cards that you are willing to accept in order to exchange your card.
                  </p>
                  <div className="search-wrapper">
                    <form>
                      <label>
                        Filter by Set:
                    
                          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                          <option value="all">All</option>
                          {pokemonSets.map((Set, index) => (
                            <option value={Set.name} key={index}>
                              {Set.name}
                              </option>
                          ))}
                        </select>
                      </label>
                    </form>
                  </div>
                  <img src={card.images.small} />
                  <div className="grid-container-popup" id="pokemonCards">
                    {filteredCards.map((card, index) => (
                      <div key={index} className="card-container-popup">
                        <img src={card.images.small} alt="Pokemon Card" />
                        {selectedCards.includes(card.id) ? (
                          <Checkbox
                            checked={true}
                            onChange={() => handleCardDeselect(card.id)}
                          />
                        ) : (
                          <Checkbox
                            checked={false}
                            onChange={() => handleCardSelect(card.id)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className='select'> 
                  <span className='selected'> Cards: </span>
                    {selectedCards.map((cardId, index) => (
                      <span className='text' key={index}>
                        {filteredCards.find((card) => card.id === cardId)?.name}
                      </span>
                    ))}
                  </div>
                  <div className="add-to-marketplace-button">
            <Button
              variant="contained"
              onClick={() => {
                addToMarketplace(card.id , selectedCards);
              }}
            >
              Add to Marketplace
            </Button>
          </div>
                </TabPanel>
              </div>
            </TabContext>
          </Box>
        </div>
      </div>
    )
  );
}

export default Popup;
