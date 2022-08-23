// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "./Token.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; 


contract Forging is Ownable {
  Token private token;

  /**
   * @notice Construct the Forging Contract
   */
  constructor() payable {
    token = new Token();
  }

  function mint(uint256 id) external onlyOwner {
    token.mint(msg.sender, id);
  }

  function balanceOf(address _of, uint256 id) external view onlyOwner returns (uint256) {
    return token.balanceOf(_of, id);
  }

  function totalSupply(uint256 id) external view onlyOwner returns (uint256) {
    return token.totalSupply(id);
  }

  /**
   * @notice Forge weaponry by consuming elements.
   */
  function forge(uint256[] calldata elements) external onlyOwner {
    
  }
}
