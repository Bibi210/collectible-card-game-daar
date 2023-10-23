// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Collection is
  ERC721,
  ERC721Enumerable,
  ERC721URIStorage,
  ERC721Burnable,
  Ownable
{
  uint256 private _nextTokenId;

  constructor(
    address initialOwner,
    string memory name,
    string memory symbol,
    uint256 nbTokens
  ) ERC721(name, symbol) Ownable(initialOwner) {
    _nextTokenId = nbTokens;
  }

  function safeMint(
    address to,
    string memory uri
  ) external onlyOwner returns (uint256) {
    if (_nextTokenId == 0) revert("Collection: no more tokens");

    uint256 tokenId = _nextTokenId--;
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
    _increaseBalance(to, 1);
    return tokenId;
  }

  function userCards(address user) external view returns (uint256[] memory) {
    uint256[] memory tokens = new uint256[](balanceOf(user));
    for (uint256 i = 0; i < tokens.length; i++)
      tokens[i] = tokenOfOwnerByIndex(user, i);
    return tokens;
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
