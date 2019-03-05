pragma solidity ^0.4.24;

// Import the library 'Roles'
import "./AccessControl.sol";

// Define a contract 'DistributorRole' to manage this role - add, remove, check
contract Distributor {

  address distributorAddress;

  // Define 2 events, one for Adding, and other for Removing
  event added();
  event removed();
  // Define a struct 'distributors' by inheriting from 'AccessControl' library, struct Role
  AccessControl.Role distributors;
  // In the constructor make the address that deploys this contract the 1st distributor
  constructor() public {
    distributorAddress= msg.sender;
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyDistributor() {
    require(msg.sender == distributorAddress);
    _;
  }

  // Define a function 'isDistributor' to check this role
  function isDistributor(address account) public view returns (bool) {
    return AccessControl.has(distributors, account);
  }

  // Define a function 'addDistributor' that adds this role
  function addDistributor(address account) public onlyDistributor {
    _addDistributor(account);
    emit added();
  }

  // Define a function 'renounceDistributor' to renounce this role
  function renounceDistributor() public {
  }

  function removeDistributor(address account) public {
    _removeDistributor(account);
    emit removed();
  }

  // Define an internal function '_addDistributor' to add this role, called by 'addDistributor'
  function _addDistributor(address account) internal {
    return AccessControl.add(distributors, account);
  }

  // Define an internal function '_removeDistributor' to remove this role, called by 'removeDistributor'
  function _removeDistributor(address account) internal {
    return AccessControl.remove(distributors, account);
  }
}
