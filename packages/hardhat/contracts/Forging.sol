// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./Token.sol";

contract Forging {
  Token private token; // the ERC1155 collection

  // Weaponry we can forge:
  uint256 public constant SHIELD = 3;
  uint256 public constant CROSSBOW = 4;
  uint256 public constant ARROW = 5;
  uint256 public constant SWORD = 6;
  mapping(address => CoolDown) public userCoolDownState;
  uint256 public constant COOLDOWNPERIOD = 1 minutes;

  event Forge(address indexed account, uint256 tokenIdCreated, uint256[] tokenIdsProvided);

  // Keep track of the cooldown state for a given address
  struct CoolDown {
    uint256 cooldowntimer;
    bool inCoolDown;
  }

  /**
   * @notice Construct the Forging Contract
   * @param tokenAddress the token address representing the ERC1155 Token.
   */
  constructor(Token tokenAddress) {
    token = Token(tokenAddress);
  }

  /**
   * @notice Mint a single token of `id`.
   * @dev note: triggers and checks the cooldown state for this address.
   * @param id the token Id to mint a single unit of.
   */
  function mint(uint256 id) external {

      // are we minting any of the tokens in [0-2]?
      if (id < 3) {
        CoolDown storage cooldownState = userCoolDownState[msg.sender];

        // we are in a potential cooldown
        // has the cooldown period passed?
        if (cooldownState.inCoolDown && block.timestamp >= cooldownState.cooldowntimer)
          cooldownState.inCoolDown = false;  // exit cooldown

        // if we are in cooldown, don't allow the mint of this token to go through
        if (cooldownState.inCoolDown)
          revert("Cannot mint! In Cooldown");
        
        // we are not in a cooldown
        // but we are minting a token with a cooldown period
        // so start the timer
        cooldownState.cooldowntimer = block.timestamp + COOLDOWNPERIOD;
        // and toggle the cooldown we just entered
        cooldownState.inCoolDown = true;
        // and finally let the mint happen as this function returns
    }
  
    token.mint(msg.sender, id, 1);
  }

  /**
   * @notice Get the metadata uri for any token type from the collection.
   * @param tokenId the token ID to get the uri for.
   * @return the base URI for the collection.
   */
  function uri(uint256 tokenId) external view returns (string memory) {
    return token.uri(tokenId);
  }

  function baseUri() external view returns (string memory) {
    return token.IMAGE_URI();
  }

  /**
   * @notice the balance of the token `id` in the `account`.
   * @param ofAddress the account to get the balance of.
   * @param id the token Id to get the balance of in the account.
   * @return the balance of the token id in the account.
   */
  function balanceOf(address ofAddress, uint256 id) external view returns (uint256) {
    return token.balanceOf(ofAddress, id);
  }

  /**
   * @notice Return the balance of multiple accounts and multiple IDs.
   * @param accounts the accounts to get the balances of.
   * @param ids the token IDs in the 1155 collection to get the balances of for the respective account.
   * @return an array of balances corresponding to the incoming parameters.
   */
  function balanceOfBatch(address[] memory accounts, uint256[] memory ids) external view returns (uint256[] memory)
  {
    return token.balanceOfBatch(accounts, ids);
  }

  /**
   * @notice return the totalSupply (global to all users) of the given token Id.
   * @param id the token Id to return the totalSupply of.
   * @return the totalSupply of the given token Id.
   */
  function totalSupply(uint256 id) external view returns (uint256) {
    return token.totalSupply(id);
  }

  /**
   * @notice trade incoming token types (`idsToTrade`) to the destination id `forId`.
   * @notice example: you can trade tokens [0, 1] (idsToTrade=[0, 1]) for two token 2's (forId=2).
   * @dev Note Calling condition: The frontend ensures that `forId` is not in `idsToTrade`.
   * @param idsToTrade the incoming ids to trade for the `forId` token.
   * @param forId the id to trade the incoming id to.
   */
  function trade(uint256[] calldata idsToTrade, uint256 forId) external {
    // first, burn the incoming tokens:
    token.burnBatch(msg.sender, idsToTrade, _createOnesArray(idsToTrade.length));

    // then, mint the new _forId tokens same amount as came in
    // example: so swap 1 iron *and* 1 carbon for a total of 2 wood)
    token.mint(msg.sender, forId, idsToTrade.length);
  }

  /**
   * @notice Forge weaponry by consuming elements.
   * @dev the outcome will be that 1 weapon has been minted.
   * @param idsToBurn the element ids to forge into weaponry.
   */
  function forge(uint256[] calldata idsToBurn) external {
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

    emit Forge(msg.sender, tokenIdToMint, idsToBurn);

    // we trade the incoming Ids by burning them (always 1 of each):
    token.burnBatch(msg.sender, idsToBurn, _createOnesArray(_length));
    // and then subsequently minting the resulting Id (the weapon, in this case):
    token.mint(msg.sender, tokenIdToMint, 1);
  }

  /**
   * @notice Burn a single token of type `id` from the sender.
   * @param id the id of the token to burn.
   */
  function burn(uint256 id) external {
    token.burn(msg.sender, id, 1);
  }

  /**
   * @notice Compute the sum of the incoming array.
   * @param arr the array to sum.
   * @return theSum the sum of the incoming array's elements.
   */
  function _sum(uint256[] calldata arr) private pure returns (uint256 theSum) {
    for (uint256 i = 0; i < arr.length; i++)
      theSum += arr[i];
  }

  /**
   * @notice Create array of 1's, example: [1,1,1,1].
   * @param arrLen the number of 1 ("one") elements to create.
   * @return ones the array containing all ones, same length as the incoming array.
   */
  function _createOnesArray(uint256 arrLen) private pure returns(uint256[] memory) {
    uint256[] memory ones = new uint256[](arrLen);
    for (uint256 i = 0; i < arrLen; i++)
      ones[i] = 1;
    return ones;
  }
}