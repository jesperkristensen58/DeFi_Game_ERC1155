// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; 
import "@openzeppelin/contracts/utils/Strings.sol";

contract Token is ERC1155, ERC1155Burnable, ERC1155Supply, Ownable {

  /**
   * @notice Construct the ERC1155 Token Contract
   * @dev We publish the item information and pictures via IPFS.
   */
  constructor() ERC1155("ipfs://QmTdMVgk11h5hFjp7vbnb8h8NFm1o9rQZjoBSoiDpYSDwi/{id}") {}

  /**
   * @notice Mint `amount` unit of tokens of type `id` to the addres `to`.
   * @param _to the address to mint the tokens to.
   * @param id the token id to mint.
   * @param amount the amount of tokens to mint.
   */
  function mint(address _to, uint256 id, uint256 amount) external onlyOwner {
    _mint(_to, id, amount, "");
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
   * @notice Burn a single token of type `id`. Only the owner can call this.
   * @param account the account to burn the token for.
   * @param id the token id to burn.
   * @param amount the amount of tokens to burn.
   */
  function burn(
        address account,
        uint256 id,
        uint256 amount
    ) public override onlyOwner {
      super.burn(account, id, amount);
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

    /**
     * @notice To be compatible with OpenSea.
     * @param _tokenId the token ID of this collection.
     * @return the full path to the image.
     */
    function uri(uint256 _tokenId) override public pure returns (string memory) {
      return string(
          abi.encodePacked(
              "ipfs://QmTdMVgk11h5hFjp7vbnb8h8NFm1o9rQZjoBSoiDpYSDwi/",
              Strings.toString(_tokenId),".json"
          )
      );
    }
}