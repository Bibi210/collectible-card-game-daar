// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Collection.sol";

contract Booster is
  ERC721,
  ERC721Enumerable,
  ERC721URIStorage,
  Ownable,
  ERC721Burnable
{
  event BoosterOpening(address, uint); /* Booster Owner and id */
  event CardCreation(address, string);
  uint256 private _nextTokenId;

  mapping(uint => string) private _pendingBoosters;

  constructor(
    address initialOwner
  ) ERC721("PokeBooster", "PokC") Ownable(initialOwner) {}

  function safeMint(address to, string memory uri) external onlyOwner {
    _safeMint(to, _nextTokenId);
    _setTokenURI(_nextTokenId, uri);
    _nextTokenId++;
  }

  function getUserBoosters(
    address user
  ) external view returns (uint256[] memory) {
    uint256[] memory tokens = new uint256[](balanceOf(user));
    for (uint256 i = 0; i < tokens.length; i++)
      tokens[i] = tokenOfOwnerByIndex(user, i);
    return tokens;
  }

  function openBooster(address owner, uint b_id) external {
    require(ownerOf(b_id) == owner, "Booster: not owner");
    _burn(b_id);
    string memory bhash = tokenURI(b_id);
    emit BoosterOpening(owner, b_id);
    _pendingBoosters[b_id] = bhash;
  }

  function stringToBytes32(
    string memory source
  ) public pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
      return 0x0;
    }
    assembly {
      result := mload(add(source, 32))
    }
  }

  struct OracleCard {
    string uri;
    uint collection;
  }

  function applyPendingBooster(
    uint b_id,
    OracleCard[] calldata oracleCards
  ) external onlyOwner {
    string memory bhash = _pendingBoosters[b_id];
    require(bytes(bhash).length != 0, "Booster: not pending");
    require(
      stringToBytes32(bhash) == keccak256(abi.encode(oracleCards)),
      "Booster: hash mismatch"
    );
    delete _pendingBoosters[b_id];
    for (uint i = 0; i < oracleCards.length; i++) {
      OracleCard memory oracleCard = oracleCards[i];
      emit CardCreation(ownerOf(b_id), oracleCard.uri);
      /* Mint */
    }
  }

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal override(ERC721, ERC721Enumerable) returns (address) {
    return super._update(to, tokenId, auth);
  }

  function _increaseBalance(
    address account,
    uint128 value
  ) internal override(ERC721, ERC721Enumerable) {
    super._increaseBalance(account, value);
  }

  function tokenURI(
    uint256 tokenId
  ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(
    bytes4 interfaceId
  )
    public
    view
    override(ERC721, ERC721Enumerable, ERC721URIStorage)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
