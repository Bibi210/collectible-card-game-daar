const express = require('express');
const axios = require('axios');
const fs = require('fs');


const app = express();
const port = process.env.PORT || 3000; 
const searchQuery = 'set.id:sv1'; // Replace with your desired search query
const page = 1;
const pageSize = 250;
const orderBy = '-set.releaseDate'; // Replace with your desired ordering field
const selectFields = 'id,name,images';

app.use(express.json());

axios({
  method: 'get',
  url: 'https://api.pokemontcg.io/v2/cards',
  Authorization: '03afe08b-77c3-42b8-886d-638a60b66f37',
  params : {
    q: searchQuery,
    page: page,
    pageSize: pageSize,
    orderBy: orderBy,
    select: selectFields
  }
  
 
})

  .then((response) => {
    // en cas de réussite de la requête
    const jsonData = response.data.data;
    const jsonString = JSON.stringify(jsonData, null, 2); // Indentation de 2 espaces pour une meilleure lisibilité

    // Enregistrez le JSON dans un fichier
    fs.writeFileSync('pokemon_data.json', jsonString);
    console.log('Données enregistrées dans pokemon_data.json');

  })


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});