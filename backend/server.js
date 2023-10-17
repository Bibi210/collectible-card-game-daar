const express = require('express');
const app = express();
const port = process.env.PORT || 3000; 


app.use(express.json());

const nftInfo = {
  cardName: "My NFT Card",
  illustration: "https://example.com/illustration.jpg",
};

const nftInfo2 = {
    cardName: "My NFT Card2",
    illustration: "https://example.com/illustration.jpg",
  };

app.get('/nft', (req, res) => {
  res.json(nftInfo);
  
});

app.get('/nft2', (req, res) => {
    res.json(nftInfo2);
    
  });


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});