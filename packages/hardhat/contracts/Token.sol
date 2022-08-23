// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; 

contract Token is ERC1155, Ownable {
  // base elements that can forge into weaponry
  uint256 public constant IRON = 0;
  uint256 public constant CARBON = 1;
  uint256 public constant WOOD = 2;
  // Weaponry
  uint256 public constant SHIELD = 3;
  uint256 public constant CROSSBOW = 4;
  uint256 public constant ARROW = 5;
  uint256 public constant SWORD = 6;

  event SetPurpose(address sender, string purpose);
  string public purpose = "Building Unstoppable Apps!!!";

  /**
   * @notice Construct the ERC1155 Token Contract
   */
  constructor() ERC1155("url/to/images{id}") {}
}
