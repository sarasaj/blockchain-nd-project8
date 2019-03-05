pragma solidity ^0.4.24;

// Import the library 'AccessControl'
import "./AccessControl.sol";

// Define a contract 'manufacturer' to manage this role - add, remove, check
contract manufacturer {

  address manufacturerAddress;
  // Define 2 events, one for Adding, and other for Removing
  event added();
  event removed();
  // Define a struct 'manufacturers' by inheriting from 'AccessControl' library, struct Role
  //https://solidity.readthedocs.io/en/develop/contracts.html#libraries
  AccessControl.Role manufacturers;
  // In the constructor make the address that deploys this contract the 1st retailer
  constructor() public {
    manufacturerAddress = msg.sender;
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyManufacturer() {
    require(msg.sender == manufacturerAddress);
    _;
  }

  // Define a function 'isManufacturer' to check this role
  function isManufacturer(address account) public view onlyManufacturer(account) returns (bool) {
     // if(account == manufacturerAddress){
     //   return true;
     // }else {
     //   return false;
     // }

     return AccessControl.has(manufacturers, account);

  }

  // Define a function 'addManufacturer' that adds this role
  function addManufacturer(address account) public onlyManufacturer {
    _addManufacturer(account);
  }

  // Define a function 'renounceManufacturer' to renounce this role
  function renounceManufacturer() public {
    _removeManufacturer(account);
  }

  // Define an internal function '_addManufacturer' to add this role, called by 'addManufacturer'
  function _addManufacturer(address account) internal {
    return AccessControl.add(manufacturers, account);
  }

  // Define an internal function '_removeManufacturer' to remove this role, called by 'renounceManufacturer'
  function _removeManufacturer(address account) internal {
    return AccessControl.remove(manufacturers, account);
  }
}
