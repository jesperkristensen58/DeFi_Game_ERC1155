//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

import "./Token.sol";

import "@openzeppelin/contracts/access/Ownable.sol"; 

contract YourContract is Ownable {
  
  /**
   * @notice Construct the Forging Contract
   */
  constructor() payable {}

  /**
   * @notice Mint new elements.
   */
  function mint() external onlyOwner {
    
  }

  /**
   * @notice Forge weaponry by consuming elements.
   */
  function forge(uint256[] calldata elements) external onlyOwner {
    
  }



  // ------ LEGACY TODO: DELETE !!! -------
  event SetPurpose(address sender, string purpose);

  string public purpose = "Building Unstoppable Apps!!!";

  function setPurpose(string memory newPurpose) public {
      purpose = newPurpose;
      console.log(msg.sender,"set purpose to",purpose);
      emit SetPurpose(msg.sender, purpose);
  }

  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}
