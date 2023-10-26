// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main is Ownable {
  uint public nbCollections;
  mapping(string => Collection) private _collections;

  constructor(address initialOwner) Ownable(initialOwner) {
    nbCollections = 0;
  }

  function createCard(
    string calldata collection_id,
    string calldata uri
  ) external onlyOwner {
    Collection collection = _collections[collection_id];
    collection.safeMint(this.owner(), uri);
  }

  function getCollection(
    string calldata collection_id
  ) external view returns (Collection) {
    return _collections[collection_id];
  }

  function nbCollection() external view returns (uint) {
    return nbCollections;
  }

  function createCollection(
    string calldata name,
    string calldata symbol,
    uint nbTokens
  ) external onlyOwner {
    Collection collection = new Collection(
      address(this),
      name,
      symbol,
      nbTokens
    );
    _collections[name] = collection;
    nbCollections++;
  }

  function assignCard(
    string calldata collection_id,
    uint token_id,
    address to
  ) external onlyOwner {
    Collection collection = _collections[collection_id];
    collection.transferFrom(this.owner(), to, token_id);
  }
}
