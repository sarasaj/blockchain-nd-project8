pragma solidity ^0.4.24;

// Import the library 'Roles'
import "./AccessControl.sol";

// Define a contract 'ConsumerRole' to manage this role - add, remove, check
contract Consumer{
  address ConsumerAddress;
  // Define 2 events, one for Adding, and other for Removing
  event added();
  event removed();
  // Define a struct 'consumers' by inheriting from 'AccessControl' library, struct Role
  AccessControl.Role consumers;
  // In the constructor make the address that deploys this contract the 1st consumer
  constructor() public {
    ConsumerAddress = msg.sender;
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyConsumer() {
    require(msg.sender == ConsumerAddress);
    _;
  }

  // Define a function 'isConsumer' to check this role
  function isConsumer(address account) public view returns (bool) {
    return AccessControl.has(consumers, account);
  }

  // Define a function 'addConsumer' that adds this role
  function addConsumer(address account) public onlyConsumer {
    _addConsumer(account);
    emit added();
  }

  // Define a function 'renounceConsumer' to renounce this role
  function renounceConsumer() public {
  }

  function removeConsumer(address account) public {
    _removeConsumer(account);
    emit removed();
  }

  // Define an internal function '_addConsumer' to add this role, called by 'addConsumer'
  function _addConsumer(address account) internal {
    return AccessControl.add(consumers, account);
  }

  // Define an internal function '_removeConsumer' to remove this role, called by 'removeConsumer'
  function _removeConsumer(address account) internal {
    return AccessControl.remove(consumers, account);
  }
}
