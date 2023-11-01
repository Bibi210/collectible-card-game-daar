import React, { useEffect, useState } from 'react';
import './Popup.css';
import TabContext from '@mui/lab/TabContext';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import TabList from '@mui/lab/TabList';
import pokemon from 'pokemontcgsdk'
import { Checkbox } from '@mui/material';
pokemon.configure({ apiKey: '03afe08b-77c3-42b8-886d-638a60b66f37' });
const items = [
  { name: "Item 1", category: "category1" },
  { name: "Item 2", category: "category2" },
  { name: "Item 3", category: "category1" },
  { name: "Item 4", category: "category3" },
  { name: "Item 5", category: "category2" }
];

function Popup({ isVisible, onClose, children, card }) {
  const [pokemonCards, setPokemonCards] = useState([]);
  const [value, setValue] = React.useState('1');
  /**search menu */
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item => {
    return (filter === 'all' || item.category === filter) &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  /*************************** */


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    async function getAllCards() {
      try {
        const cards = await pokemon.card.where({ pageSize: 100 }); // Adjust the pageSize as needed
        setPokemonCards(cards.data);
        console.log("here")
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    }

    getAllCards();
  }, []);
  return (
    isVisible && (
      <div className="popup-overlay">
        <div className="popup">
          
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="Details" value="1" />
                  <Tab label="Exchange Card" value="2" />
                </TabList>
                <button className="close-button" onClick={onClose}>Close</button>
              </Box>
              <TabPanel className='panel' value="1">
                <h2>{card.name}</h2> {/* Display the card's name */}
                {children}
                <img src={card.images.small} />
              </TabPanel>
              <div className='panel2'>
                <TabPanel className='panel' value="2">

                  <h2>{card.name}</h2> {/* Display the card's name */}
                  {children}
                  <p className='exchange-para'> Select 1 to 5 cards that you are willing to accept in order to exchange your card.</p>
                  <div className="search-wrapper">
                    <form>
                      <label>Filter by:
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                          <option value="all">All</option>
                          <option value="category1">Category 1</option>
                          <option value="category2">Category 2</option>
                          <option value="category3">Category 3</option>
                        </select>
                      </label>
                    </form>

                  </div>
                  <img src={card.images.small} />
                  <div className="grid-container-popup" id="pokemonCards">
                    {pokemonCards.map((card, index) => (
                      <div key={index} className="card-container-popup">
                        <img src={card.images.small} alt="Pokemon Card" />
                        <Checkbox></Checkbox>
                      </div>
                    ))}
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
