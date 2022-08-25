// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./Token.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Forging is Ownable, Pausable {
  Token private token; // the ERC1155 collection
  // Weaponry we can forge:
  uint256 public constant SHIELD = 3;
  uint256 public constant CROSSBOW = 4;
  uint256 public constant ARROW = 5;
  uint256 public constant SWORD = 6;

  event Forge(address indexed account, uint256 tokenIdCreated, uint256[] tokenIdsProvided);

  /**
   * @notice Construct the Forging Contract
   * @dev sets the owner() as well as the deployer.
   * @param tokenAddress the token address representing the ERC1155 Token.
   */
  constructor(Token tokenAddress) {
    token = Token(tokenAddress);
  }

  /**
   * @notice Mint a single token of `id`.
   * @param id the token Id to mint a single unit of.
   */
  function mint(uint256 id) external onlyOwner {
    token.mint(msg.sender, id, 1);
  }

  /**
   * @notice Get the metadata uri for any token type from the collection.
   * @param _tokenId the token ID to get the uri for.
   * @return the base URI for the collection.
   */
  function uri(uint256 _tokenId) public view returns (string memory) {
    return token.uri(_tokenId);
  }

  function baseUri() external view onlyOwner returns (string memory) {
    return token.imageUri();
  }

  /**
   * @notice the balance of the token `id` in the `account`.
   * @param _of the account to get the balance of.
   * @param id the token Id to get the balance of in the account.
   * @return the balance of the token id in the account.
   */
  function balanceOf(address _of, uint256 id) external view onlyOwner returns (uint256) {
    return token.balanceOf(_of, id);
  }

  /**
   * @notice Return the balance of multiple accounts and multiple IDs.
   * @param accounts the accounts to get the balances of.
   * @param ids the token IDs in the 1155 collection to get the balances of for the respective account.
   * @return an array of balances corresponding to the incoming parameters.
   */
  function balanceOfBatch(address[] memory accounts, uint256[] memory ids) public view onlyOwner returns (uint256[] memory)
  {
    return token.balanceOfBatch(accounts, ids);
  }

  /**
   * @notice return the totalSupply (global to all users) of the given token Id.
   * @param id the token Id to return the totalSupply of.
   * @return the totalSupply of the given token Id.
   */
  function totalSupply(uint256 id) external view onlyOwner returns (uint256) {
    return token.totalSupply(id);
  }

  /**
   * @notice trade incoming token types (`_idsToTrade`) to the destination id `_forId`.
   * @notice example: you can trade tokens [0, 1] (_idsToTrade=[0, 1]) for two token 2's (_forId=2).
   * @dev Note Calling condition: The frontend ensures that `_forId` is not in `_idsToTrade`.
   * @param _idsToTrade the incoming ids to trade for the `_forId` token.
   * @param _forId the id to trade the incoming id to.
   */
  function trade(uint256[] calldata _idsToTrade, uint256 _forId) external onlyOwner {
    // first, burn the incoming tokens:
    token.burnBatch(msg.sender, _idsToTrade, _createOnesArray(_idsToTrade.length));

    // then, mint the new _forId tokens same amount as came in
    // example: so swap 1 iron *and* 1 carbon for a total of 2 wood)
    token.mint(msg.sender, _forId, _idsToTrade.length);
  }

  /**
   * @notice Forge weaponry by consuming elements.
   * @dev the outcome will be that 1 weapon has been minted.
   * @param idsToBurn the element ids to forge into weaponry.
   */
  function forge(uint256[] calldata idsToBurn) external onlyOwner {
    uint256 _length = idsToBurn.length;
    require((_length > 1 && _length < 4), "Unexpected number of elements for forging!");
    
    uint256 tokenIdToMint; // which Id are we forging from burning the incoming elements?

    // since we already have the length, check special case:
    if (_length == 3) {
      // must be [0, 1, 2] => mint 6
      tokenIdToMint = SWORD;
    } else {
      // must be length 2
      // switch on the sum which is unique in all remaining cases
      uint256 theSum = _sum(idsToBurn);
      
      if (theSum == 1) {
        // [0, 1] => mint 3
        tokenIdToMint = SHIELD;
      } else if (theSum == 2) {
        // [0, 2] => mint 5
        tokenIdToMint = ARROW;
      } else {
        // theSum is 3
        // [1, 2] => mint 4
        tokenIdToMint = CROSSBOW;
      }
    }

    // we trade the incoming Ids by burning them (always 1 of each):
    token.burnBatch(msg.sender, idsToBurn, _createOnesArray(_length));
    // and then subsequently minting the resulting Id (the weapon, in this case):
    token.mint(msg.sender, tokenIdToMint, 1);

    emit Forge(msg.sender, tokenIdToMint, idsToBurn);
  }

  /**
   * @notice Burn a single token of type `id` from the sender.
   * @param id the id of the token to burn.
   */
  function burn(uint256 id) external onlyOwner {
    token.burn(msg.sender, id, 1);
  }

  /**
   * @notice Compute the sum of the incoming array.
   * @param arr the array to sum.
   * @return theSum the sum of the incoming array's elements.
   */
  function _sum(uint256[] calldata arr) private pure returns (uint256 theSum) {
    for (uint256 i; i < arr.length; i++)
      theSum += arr[i];
  }

  /**
   * @notice Create array of 1's, example: [1,1,1,1].
   * @param arrLen the number of 1 ("one") elements to create.
   * @return ones the array containing all ones, same length as the incoming array.
   */
  function _createOnesArray(uint256 arrLen) private pure returns(uint256[] memory) {
    uint256[] memory ones = new uint256[](arrLen);
    for (uint256 i; i < arrLen; i++)
      ones[i] = 1;
    return ones;
  }
}