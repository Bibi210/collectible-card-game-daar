import React, { useEffect, useState }  from 'react';
import './Home.css';
import {Link } from 'react-router-dom';

const home = () => {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [pokemonData, setPokemonData] = useState([]);
  
  // Ethereum Interaction
  useEffect(() => {
    async function enableEthereum() {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (err) {
        if (err.code === 4001) {
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      }
    }

    
    async function getAccount() {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      setCurrentAccount(account);
    }

    async function handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        console.log('Please connect to MetaMask.');
      } else if (accounts[0] !== currentAccount) {
        setCurrentAccount(accounts[0]);
      }
    }

    enableEthereum();
    getAccount();

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.request({ method: 'eth_accounts' }).then(handleAccountsChanged);
  }, [currentAccount]);

  // Load Pokemon Cards
  useEffect(() => {
    function loadPokemonCards() {
      fetch('pokemon_data.json')
        .then((response) => response.json())
        .then((data) => {
          setPokemonData(data);
        })
        .catch((error) => {
          console.error('Erreur :', error);
        });
    }

    loadPokemonCards();
  }, []);

  return (
    <html>
    <div className="page-wrapper">
     
      <h2>Account: <span className="showAccount">{currentAccount}</span></h2>
      <section className="headline">
        <h1>Pokemon Cards NFTs</h1>
        <p>Gotta catch them all !</p>
      </section>
    </div>
    
    <div className="grid-container" id="pokemonCards">
      {pokemonData.map((card, index) => (
        <div key={index} className="card-container">
          <img src={card.images.small} alt="Pokemon Card" />
        </div>
      ))}
    </div>
    </html>

  )}


export default home