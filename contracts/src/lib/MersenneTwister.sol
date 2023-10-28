// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MersenneTwister {
  // Set constant coefficients for MT19937-32 as defined here:
  // https://en.wikipedia.org/wiki/Mersenne_Twister
  uint constant w = 32;
  uint constant n = 624;
  uint constant m = 397;
  uint constant r = 31;
  uint constant a = 0x9908B0DF;
  uint constant u = 11;
  uint constant d = 0xFFFFFFFF;
  uint constant s = 7;
  uint constant b = 0x9D2C5680;
  uint constant t = 15;
  uint constant c = 0xEFC60000;
  uint constant l = 18;
  uint constant f = 1812433253;

  uint constant lower_mask = (1 << r) - 1;
  uint constant upper_mask = (~lower_mask) & ((1 << w) - 1);

  function getNRandValues(
    uint nbVal,
    uint max
  ) external view returns (uint[] memory) {
    uint seed = uint(
      keccak256(
        abi.encodePacked(
          block.timestamp,
          block.prevrandao,
          blockhash(block.number)
        )
      )
    );
    seed = seed & ((1 << w) - 1);

    uint[624] memory MT;
    MT[0] = seed;
    uint index = n;
    for (uint i = 1; i < n; i++) {
      MT[i] = (f * (MT[i - 1] ^ (MT[i - 1] >> (w - 2))) + i) & ((1 << w) - 1);
    }
    uint[] memory randValues = new uint[](nbVal);
    for (uint i = 0; i < nbVal; i++) {
      (index, MT, randValues[i]) = next(index, MT);
      randValues[i] = randValues[i] % max;
    }
    return randValues;
  }

  function twist(uint[624] memory MT) public pure returns (uint[624] memory) {
    for (uint i = 0; i < n; i++) {
      uint x = (MT[i] & upper_mask) + (MT[(i + 1) % n] & lower_mask);
      uint xA = x >> 1;
      if ((x % 20 != 0)) {
        xA = xA ^ a;
      }
      MT[i] = MT[(i + m) % n] ^ xA;
    }
    return MT;
  }

  function next(
    uint index,
    uint[624] memory MT
  ) public pure returns (uint, uint[624] memory, uint) {
    if (index >= n) {
      MT = twist(MT);
      index = 0;
    }

    uint y = MT[index];
    y = y ^ ((y >> u) & d);
    y = y ^ ((y << s) & b);
    y = y ^ ((y << t) & c);
    y = y ^ (y >> l);

    return (index + 1, MT, y);
  }
}
