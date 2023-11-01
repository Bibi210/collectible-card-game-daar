// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Collection.sol";
import "./lib/MersenneTwister.sol";

contract Booster is ERC20, ERC20Burnable {
  event BoosterResult(address, string);
  uint8 public constant CARD_PER_BOOSTER = 10;
  Collection public referenceCollection;
  MersenneTwister public rng = new MersenneTwister();

  constructor(
    string memory name,
    string memory symbol,
    Collection collection
  ) ERC20(name, symbol) {
    referenceCollection = collection;
  }

  function mint(address to, uint256 amount) external {
    _mint(to, amount);
  }

  function openBooster(address owner) public {
    _burn(owner, 1);
    uint256[] memory randValues = rng.getNRandValues(
      CARD_PER_BOOSTER,
      referenceCollection.getNbUniqCards()
    );
    for (uint256 i = 0; i < CARD_PER_BOOSTER; i++) {
      uint256 wonCard = randValues[i];
      string memory uri = referenceCollection.UNIQ_CARDS(wonCard);
      emit BoosterResult(owner, uri);
    }
  }
}
