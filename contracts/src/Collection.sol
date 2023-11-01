// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Booster.sol";

contract Collection is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
  uint256 private _nextTokenId;
  uint256 public constant MAX_TOKENS = 10000;
  string[] public UNIQ_CARDS;
  Booster private booster;

  constructor(
    address initialOwner,
    string memory name,
    string memory symbol,
    string[] memory UniqCards
  ) ERC721(name, symbol) Ownable(initialOwner) {
    UNIQ_CARDS = UniqCards;
    booster = new Booster(name, symbol, this);
    transferOwnership(address(booster));
  }

  function safeMint(address to, string memory uri) external onlyOwner {
    if (_nextTokenId == MAX_TOKENS) revert("Max tokens reached");
    uint256 tokenId = _nextTokenId++;
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
  }

  function userCards() external view returns (string[] memory) {
    string[] memory cards = new string[](balanceOf(msg.sender));
    for (uint256 i = 0; i < cards.length; i++)
      cards[i] = tokenURI(tokenOfOwnerByIndex(msg.sender, i));
    return cards;
  }

  function getNbUniqCards() external view returns (uint256) {
    return UNIQ_CARDS.length;
  }

  function buyBooster() external {
    booster.mint(msg.sender, 1);
  }

  function openBooster() external {
    booster.openBooster(msg.sender);
  }

  function userBoosters() external view returns (uint256) {
    return booster.balanceOf(msg.sender);
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

  function nbAvailableTokens() internal view returns (uint256) {
    return _nextTokenId;
  }
}
