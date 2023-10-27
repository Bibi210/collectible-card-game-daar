// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Booster.sol";

contract Main is Ownable {
  uint public nbCollections;
  Booster public boostersNFT;
  mapping(string => uint) private _nameToId;
  mapping(uint => Collection) private _idToCollection;

  constructor(address initialOwner) Ownable(initialOwner) {
    nbCollections = 0;
    boostersNFT = new Booster(address(this));
  }

  function createBooster(address to, string calldata uri) external onlyOwner {
    boostersNFT.safeMint(to, uri);
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

    _nameToId[name] = nbCollections;
    _idToCollection[nbCollections] = collection;
    nbCollections++;
  }

  function getCollectionFromId(uint id) public view returns (Collection) {
    return _idToCollection[id];
  }

  function getCollectionFromName(
    string calldata name
  ) external view returns (Collection) {
    return getCollectionFromId(_nameToId[name]);
  }
}
