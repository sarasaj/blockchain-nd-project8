pragma solidity ^0.4.24;

// Import the library 'AccessControl'
import "./AccessControl.sol";

// Define a contract 'manufacturer' to manage this role - add, remove, check
contract manufacturer{

  address mowner;
  // Define 2 events, one for Adding, and other for Removing
  event added();
  event removed();
  // Define a struct 'manufacturer' by inheriting from 'AccessControl' library, struct Role
struct manufacturer is role {

}
  // In the constructor make the address that deploys this contract the 1st retailer
  constructor() public {
    mowner = msg.sender;
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyManufacturer(address account) {
    require(msg.sender == mowner);
    _;
  }

  // Define a function 'isManufacturer' to check this role
  function isManufacturer(address account) public view returns (bool) {

  }

  // Define a function 'addManufacturer' that adds this role
  function addManufacturer(address account) public onlyRetailer {

  }

  // Define a function 'renounceManufacturer' to renounce this role
  function renounceManufacturer() public {

  }

  // Define an internal function '_addManufacturer' to add this role, called by 'addRetailer'
  function _addManufacturer(address account) internal {

  }

  // Define an internal function '_removeManufacturer' to remove this role, called by 'removeRetailer'
  function _removeManufacturer(address account) internal {

  }
}
