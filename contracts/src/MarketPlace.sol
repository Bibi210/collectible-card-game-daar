// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketPlace is Ownable {
  constructor(address owner) Ownable(owner) {
    tradesCount = 0;
    aliveTrades = 0;
  }

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
    spots[tradesCount] = Card(
      uri,
      collectionId,
      acceptedCurrency,
      msg.sender,
      false,
      Trade("", 0, address(0)),
      tradesCount
    );

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
    Trade memory buyerCard = Trade(uri, collectionId, msg.sender);
    Card storage inMarketCard = spots[spotId];
    if (inMarketCard.done) revert("Card already sold");

    Collection inMarketCollection = _idToCollection[inMarketCard.collectionId];
    Collection fromBuyerCollection = _idToCollection[buyerCard.collectionId];

    uint256 buyerTokenId = fromBuyerCollection.firstTokenOwned(
      buyerCard.owner,
      buyerCard.uri
    );

    aliveTrades--;
    inMarketCard.done = true;

    uint256 inMarketTokenId = inMarketCollection.firstTokenOwned(
      inMarketCard.owner,
      inMarketCard.id
    );

    ValidateTrade memory buyer = ValidateTrade(
      buyerTokenId,
      buyerCard.collectionId,
      msg.sender
    );

    ValidateTrade memory seller = ValidateTrade(
      inMarketTokenId,
      inMarketCard.collectionId,
      inMarketCard.owner
    );

    emit Exchange(buyer, seller);
    _idToCollection[inMarketCard.collectionId].superTransferFrom(
      inMarketCard.owner,
      buyerCard.owner,
      inMarketTokenId
    );
    _idToCollection[buyerCard.collectionId].superTransferFrom(
      buyerCard.owner,
      inMarketCard.owner,
      buyerTokenId
    );
    inMarketCard.acceptedCurrency = buyerCard;
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
