// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main is Ownable {
  uint public nbCollections;
  mapping(uint => Collection) private _collections;

  constructor(address initialOwner) Ownable(initialOwner) {
    nbCollections = 0;
  }

  function createCard(
    uint collection_id,
    string calldata uri
  ) external onlyOwner {
    Collection collection = _collections[collection_id];
    collection.safeMint(this.owner(), uri);
  }

  function getCollection(
    uint collection_id
  ) external view returns (Collection) {
    return _collections[collection_id];
  }

  function createCollection(
    string calldata name,
    string calldata symbol,
    uint nbTokens
  ) external onlyOwner {
    Collection collection = new Collection(
      this.owner(),
      name,
      symbol,
      nbTokens
    );
    _collections[nbCollections] = collection;
    nbCollections++;
  }

  function assignCard(
    uint collection_id,
    uint token_id,
    address to
  ) external onlyOwner {
    Collection collection = _collections[collection_id];
    collection.transferFrom(this.owner(), to, token_id);
  }

  function assignN_Cards(
    uint collection_id,
    uint n,
    address to
  ) external onlyOwner {
    Collection collection = _collections[collection_id];
    uint nbSysOwned = collection.balanceOf(this.owner());
    if (n > nbSysOwned) revert("Main: not enough cards");
    for (uint i = 0; i < n; i++) {
      uint tokenId = collection.tokenOfOwnerByIndex(this.owner(), i);
      collection.transferFrom(this.owner(), to, tokenId);
    }
  }
}
