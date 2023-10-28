// SPDX-License-Identifier: MIT
// Implementation of AES in Solidity
pragma solidity ^0.8.20;

contract AES {
  uint8[256] private sbox;
  uint8[256] private un_sbox;

  uint8[16] MixMatrix;
  uint8[16] Un_MixMatrix;

  constructor() {
    MixMatrix = [
      0x02,
      0x03,
      0x01,
      0x01,
      0x01,
      0x02,
      0x03,
      0x01,
      0x01,
      0x01,
      0x02,
      0x03,
      0x03,
      0x01,
      0x01,
      0x02
    ];

    Un_MixMatrix = [
      0x0e,
      0x0b,
      0x0d,
      0x09,
      0x09,
      0x0e,
      0x0b,
      0x0d,
      0x0d,
      0x09,
      0x0e,
      0x0b,
      0x0b,
      0x0d,
      0x09,
      0x0e
    ];
    initialise_aes_sbox();
  }

  function ROTL8(uint8 a, uint8 n) internal pure returns (uint8) {
    return (a << n) | (a >> (8 - n));
  }

  function index(
    uint8 x,
    uint8 y,
    uint8 line_size
  ) internal pure returns (uint8) {
    return x + (y * line_size);
  }

  function galloiMultiply(uint8 a, uint8 b) internal pure returns (uint8) {
    uint8 p = 0;
    uint8 counter;
    uint8 hi_bit_set;
    for (counter = 0; counter < 8; counter++) {
      if (b & 1 == 1) {
        p ^= a;
      }
      hi_bit_set = a & 0x80;
      a <<= 1;
      if (hi_bit_set == 0x80) {
        a ^= 0x1b;
      }
      b >>= 1;
    }
    return p;
  }

  function initialise_aes_sbox() internal {
    // Source : https://en.wikipedia.org/wiki/Rijndael_S-box
    uint8 p = 1;
    uint8 q = 1;

    /* 0 is a special case since it has no inverse */
    sbox[0] = 0x63;
    un_sbox[0x63] = 0;
    /* loop invariant: p * q == 1 in the Galois field */
    do {
      /* multiply p by 3 */
      p ^= (p << 1) ^ (p & 0x80 != 0 ? 0x1b : 0);
      /* divide q by 3 (equals multiplication by 0xf6) */
      q ^= q << 1;
      q ^= q << 2;
      q ^= q << 4;
      q ^= q & 0x80 != 0 ? 0x09 : 0;
      /* compute the affine transformation */
      uint8 xformed = q ^ ROTL8(q, 1) ^ ROTL8(q, 2) ^ ROTL8(q, 3) ^ ROTL8(q, 4);
      sbox[p] = xformed ^ 0x63;
      un_sbox[xformed ^ 0x63] = p;
    } while (p != 1);
  }

  function shiftRow(
    uint8[32] memory word,
    uint8 line,
    uint8 nbshift
  ) internal pure {
    uint8 start_index = index(0, line, 4);
    uint8 end_indice = index(4, line, 4);
    uint8 start;
    while (nbshift % 4 != 0) {
      start = word[start_index];
      for (uint8 i = start_index; i < end_indice; i++) {
        if (i + 1 == end_indice) word[i] = start;
        else word[i] = word[i + 1];
      }
      nbshift--;
    }
  }

  function shiftRows(uint8[32] memory state) internal pure {
    for (uint8 i = 0; i < 4; i++) shiftRow(state, i, i);
  }

  function unshiftRow(
    uint8[32] memory word,
    uint8 line,
    uint8 nbshift
  ) internal pure {
    uint8 start_index = index(0, line, 4);
    uint8 end_indice = index(4, line, 4);
    uint8 end;
    while (nbshift % 4 != 0) {
      end = word[end_indice - 1];
      for (uint8 i = end_indice - 1; i >= start_index; i--) {
        if (i == start_index) word[i] = end;
        else word[i] = word[i - 1];
      }
      nbshift--;
    }
  }

  function unshiftRows(uint8[32] memory state) internal pure {
    for (uint8 i = 0; i < 4; i++) unshiftRow(state, i, i);
  }

  function SubBytes(uint8[32] memory state) internal view {
    for (uint8 i = 0; i < 32; i++) state[i] = sbox[state[i]];
  }

  function unSubBytes(uint8[32] memory state) internal view {
    for (uint8 i = 0; i < 32; i++) state[i] = un_sbox[state[i]];
  }

  function mixColumn(uint8[32] memory state, uint8 nbColumns) internal view {
    uint8 tmp;
    uint8[32] memory output = state;
    for (uint8 i = 0; i < 4; i++) {
      tmp = 0;
      for (uint8 j = 0; j < 4; j++)
        tmp ^= galloiMultiply(
          state[index(nbColumns, j, 4)],
          MixMatrix[index(j, i, 4)]
        );

      output[index(nbColumns, i, 4)] = tmp;
    }
    state = output;
  }
}
