// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketPlace is Ownable {
  mapping(uint => Collection) private _idToCollection;
  event Exchange(ValidateTrade soldCard, ValidateTrade acceptedTrade);
  struct Card {
    string id;
    uint256 collectionId;
    string[] acceptedCurrencies;
    address owner;
    bool done;
    Trade acceptedCurrency;
    uint256 spotId;
  }
  struct Trade {
    string uri;
    uint256 collectionId;
    address owner;
  }

  struct ValidateTrade {
    uint256 tokenId;
    uint256 collectionId;
    address owner;
  }

  uint256 public tradesCount = 0;
  uint256 public aliveTrades = 0;
  mapping(uint256 => Card) private spots;

  constructor(address owner) Ownable(owner) {
    tradesCount = 0;
    aliveTrades = 0;
  }

  function addCollection(
    uint256 collectionId,
    Collection collection
  ) external onlyOwner {
    _idToCollection[collectionId] = collection;
  }

  function sellCard(
    string calldata uri,
    uint256 collectionId,
    string[] calldata acceptedCurrency
  ) external {
    Card storage card = spots[tradesCount];
    card.id = uri;
    card.collectionId = collectionId;
    card.acceptedCurrencies = new string[](acceptedCurrency.length);
    for (uint256 i = 0; i < acceptedCurrency.length; i++) 
      card.acceptedCurrencies[i] = acceptedCurrency[i];
    
    card.owner = msg.sender;
    card.done = false;
    card.spotId = tradesCount;

    aliveTrades++;
    tradesCount++;
  }

  function unSellCard(uint256 spotId) external {
    Card storage card = spots[spotId];
    if (card.done) revert("Card already sold");
    if (card.owner != msg.sender) revert("You can't unSell this card");
    aliveTrades--;
    card.done = true;
  }

  function buyCard(
    uint256 spotId,
    string calldata uri,
    uint256 collectionId
  ) external {
    Trade memory usedCard = Trade(uri, collectionId, msg.sender);
    Card storage card = spots[spotId];
    if (card.done) revert("Card already sold");

    Collection soldCollection = _idToCollection[card.collectionId];
    Collection boughtCollection = _idToCollection[usedCard.collectionId];

    uint256 used = boughtCollection.firstTokenOwned(
      usedCard.owner,
      usedCard.uri
    );

    aliveTrades--;
    card.done = true;

    uint256 bought = soldCollection.firstTokenOwned(card.owner, card.id);

    ValidateTrade memory buyer = ValidateTrade(
      used,
      usedCard.collectionId,
      msg.sender
    );

    ValidateTrade memory seller = ValidateTrade(
      bought,
      card.collectionId,
      card.owner
    );

    emit Exchange(buyer, seller);
    card.acceptedCurrency = usedCard;
  }

  function seeMarketPlace() external view returns (Card[] memory) {
    Card[] memory cards = new Card[](aliveTrades);
    uint256 j = 0;
    for (uint256 i = 0; i < tradesCount; i++) {
      if (!spots[i].done) {
        cards[j] = spots[i];
        j++;
      }
    }
    return cards;
  }
}
