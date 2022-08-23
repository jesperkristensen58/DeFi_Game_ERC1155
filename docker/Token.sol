// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; 

contract Token is ERC1155, ERC1155Burnable, ERC1155Supply, Ownable {
  // base elements that can forge into weaponry
  uint256 public constant IRON = 0;
  uint256 public constant CARBON = 1;
  uint256 public constant WOOD = 2;
  // Weaponry
  uint256 public constant SHIELD = 3;
  uint256 public constant CROSSBOW = 4;
  uint256 public constant ARROW = 5;
  uint256 public constant SWORD = 6;
  
  /**
   * @notice Construct the ERC1155 Token Contract
   * @dev We publish the item information and pictures via IPFS.
   */
  constructor() ERC1155("ipfs://QmTdMVgk11h5hFjp7vbnb8h8NFm1o9rQZjoBSoiDpYSDwi/{id}") {}

  /**
   * @notice Mint 1 unit of token `id` to the contract owner.
   * @param id the token id to mint.
   */
  function mint(address _to, uint256 id) external onlyOwner {
    _mint(_to, id, 1, "");
  }

  /**
   * @notice Specify that burnBatch can only be called by the owner.
   * @dev ids and values need to be the same length due to their 1:1 mapping.
   * @param account the account to burn tokens for
   * @param ids the token ids to burn.
   * @param values the amount of tokens to burn.
   */
  function burnBatch(
        address account,
        uint256[] memory ids,
        uint256[] memory values
    ) public override onlyOwner {
      super.burnBatch(account, ids, values);
  }

  /**
   * @notice Burn a single token. Only the owner can call this.
   * @param account the account to burn the token for.
   * @param id the token id to burn.
   */
  function burn(
        address account,
        uint256 id,
        uint256
    ) public override onlyOwner {
      super.burn(account, id, 1);
    }

  /**
   * @dev Override the before token transfer function.
   */
  function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}