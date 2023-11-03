// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Booster.sol";
import "./MarketPlace.sol";

contract Main is Ownable {
  uint public nbCollections;
  mapping(string => uint) private _nameToId;
  mapping(uint => Collection) private _idToCollection;

  MarketPlace private _marketPlace;

  constructor(address initialOwner) Ownable(initialOwner) {
    nbCollections = 0;
    _marketPlace = new MarketPlace(address(this));
  }

  function createCollection(
    string calldata name,
    string calldata symbol,
    string[] calldata uniqCards
  ) external onlyOwner {
    Collection collection = new Collection(owner(), name, symbol, uniqCards);

    _nameToId[name] = nbCollections;
    _idToCollection[nbCollections] = collection;
    _marketPlace.addCollection(nbCollections, collection);
    nbCollections++;
  }

  function getMarketPlace() external view returns (MarketPlace) {
    return _marketPlace;
  }

  function getCollectionFromId(uint id) public view returns (Collection) {
    return _idToCollection[id];
  }

  function getCollectionFromName(
    string calldata name
  ) public view returns (Collection) {
    return getCollectionFromId(_nameToId[name]);
  }

  function getNbCollections() external view returns (uint) {
    return nbCollections;
  }
}
