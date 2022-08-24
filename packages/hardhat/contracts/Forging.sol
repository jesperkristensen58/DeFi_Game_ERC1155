// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "./Token.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; 

contract Forging is Ownable {
  Token private token;

  /**
   * @notice Construct the Forging Contract
   * @param tokenAddress the token address representing the ERC1155 Token.
   */
  constructor(Token tokenAddress) {
    token = Token(tokenAddress);
  }

  function mint(uint256 id) external onlyOwner {
    token.mint(msg.sender, id, 1);
  }

  function balanceOf(address _of, uint256 id) external view onlyOwner returns (uint256) {
    return token.balanceOf(_of, id);
  }

  /**
   * @notice return the totalSupply (global to all users) of the given token Id.
   * @param id the token Id to return the totalSupply of.
   * @return the totalSupply of the given token Id.
   */
  function totalSupply(uint256 id) external view onlyOwner returns (uint256) {
    return token.totalSupply(id);
  }

  function trade(uint256[] calldata ids, uint256 _forId) external onlyOwner {
    uint256[] memory values = new uint256[](ids.length);
    for (uint256 i; i < ids.length; i++)
      values[i] = 1;
    
    token.burnBatch(msg.sender, ids, values);
    // mint one new token per however many were burned
    token.mint(msg.sender, _forId, ids.length);
  }

  /**
   * @notice Forge weaponry by consuming elements.
   * @param ids the element ids to forge into weaponry.
   */
  function forge(uint256[] calldata ids) external onlyOwner {
    
  }
}
