// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketPlace is Ownable {
  mapping(uint => Collection) private _idToCollection;
  event Exchange(Card soldCard, Trade acceptedTrade);
  struct Card {
    uint256 id;
    uint256 collectionId;
    string[] acceptedCurrencies;
    address owner;
    bool done;
    Trade acceptedCurrency;
  }
  struct Trade {
    string uri;
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
    Collection collection = _idToCollection[collectionId];
    uint256 cardId = collection.firstTokenOwned(msg.sender, uri);

    Card storage card = spots[tradesCount];
    card.id = cardId;
    card.collectionId = collectionId;
    card.acceptedCurrencies = new string[](acceptedCurrency.length);
    for (uint256 i = 0; i < acceptedCurrency.length; i++) {
      card.acceptedCurrencies[i] = acceptedCurrency[i];
    }
    card.owner = msg.sender;
    card.done = false;

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

  function buyCard(uint256 spotId, Trade calldata usedCard) external {
    Card storage card = spots[spotId];
    if (card.done) revert("Card already sold");
    if (card.owner == msg.sender) revert("You can't buy your own card");

    Collection soldCollection = _idToCollection[card.collectionId];
    Collection boughtCollection = _idToCollection[usedCard.collectionId];

    boughtCollection.firstTokenOwned(msg.sender, usedCard.uri);
    aliveTrades--;
    card.id = soldCollection.firstTokenOwned(
      card.owner,
      card.acceptedCurrency.uri
    );
    emit Exchange(card, usedCard);
    card.done = true;
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
