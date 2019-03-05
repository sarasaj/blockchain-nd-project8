pragma solidity ^0.4.24;

// Import the library 'Roles'
import "./AccessControl.sol";

// Define a contract 'RetailerRole' to manage this role - add, remove, check
contract Retailer{

  address retailerAddress;

  // Define 2 events, one for Adding, and other for Removing
  event added();
  event removed();
  // Define a struct 'retailers' by inheriting from 'AccessControl' library, struct Role
  AccessControl.Role retailers;
  // In the constructor make the address that deploys this contract the 1st retailer
  constructor() public {
    retailerAddress = msg.sender;
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyRetailer() {
    require(msg.sender == retailerAddress);
    _;
  }

  // Define a function 'isRetailer' to check this role
  function isRetailer(address account) public view returns (bool) {
    return AccessControl.has(retailers, account);
  }

  // Define a function 'addRetailer' that adds this role
  function addRetailer(address account) public onlyRetailer {
    _addRetailer(account);
    emit added();
  }

  // Define a function 'renounceRetailer' to renounce this role
  function renounceRetailer() public {
  }

  function removeRetailer(address account) public {
    _removeRetailer(account);
    emit removed();
  }

  // Define an internal function '_addRetailer' to add this role, called by 'addRetailer'
  function _addRetailer(address account) internal {
    return AccessControl.add(retailers, account);
  }

  // Define an internal function '_removeRetailer' to remove this role, called by 'removeRetailer'
  function _removeRetailer(address account) internal {
    return AccessControl.remove(retailers, account);
  }
}
