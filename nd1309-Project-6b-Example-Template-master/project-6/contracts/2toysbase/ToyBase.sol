pragma solidity ^0.4.24;

//import "./AccessControl.sol";
// Define a contract 'ToyBase'
contract ToyBase {

  // Define 'owner'
  address owner;

  // Define a variable called 'upc' for Universal Product Code (UPC)
  uint  upc;

  // Define a variable called 'sku' for Stock Keeping Unit (SKU)
  uint  sku;

  // Define a public mapping 'toys' that maps the UPC to an Toy.
  mapping (uint => Toy) toys;

  // Define a public mapping 'toysHistory' that maps the UPC to an array of TxHash,
  // that track its journey through the supply chain -- to be sent from DApp.
  mapping (uint => string[]) toysHistory;

  // Define enum 'State' with the following values:
  enum State
  {
    Designed,  // 0
    Approved,  // 1
    UnderProduction, //2
    Packed,     // 3
    ForSale,    // 4
    Sold,       // 5
    Shipped,    // 6
    Received,   // 7
    Purchased   // 8
    }

  State constant defaultState = State.Designed;

  // Define a struct 'Toy' with the following fields:
  struct Toy {
    uint    sku;  // Stock Keeping Unit (SKU)
    uint    upc; // Universal Product Code (UPC), generated by the manufacturer, goes on the package, can be verified by the Consumer
    address ownerID;  // Metamask-Ethereum address of the current owner as the product moves through 8 stages
    address originManufactureID; // Metamask-Ethereum address of the Farmer
    string  originManufactureName; // Farmer Name
    string  originManufactureInformation;  // Farmer Information
    string  originManufactureLatitude; // Farm Latitude
    string  originManufactureLongitude;  // Farm Longitude
    uint    productID;  // Product ID potentially a combination of upc + sku
    string  productNotes; // Product Notes
    uint    productPrice; // Product Price
    State   itemState;  // Product State as represented in the enum above
    address distributorID;  // Metamask-Ethereum address of the Distributor
    address retailerID; // Metamask-Ethereum address of the Retailer
    address consumerID; // Metamask-Ethereum address of the Consumer
  }

  // Define (9) events with the same 9 state values and accept 'upc' as input argument
  event Designed(uint upc);
  event Approved(uint upc);
  event UnderProduction(uint upc);
  event Packed(uint upc);
  event ForSale(uint upc);
  event Sold(uint upc);
  event Shipped(uint upc);
  event Received(uint upc);
  event Purchased(uint upc);

  // Define a modifer that checks to see if msg.sender == owner of the contract
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  // Define a modifer that verifies the Caller
  modifier verifyCaller (address _address) {
    require(msg.sender == _address);
    _;
  }

  // Define a modifier that checks if the paid amount is sufficient to cover the price
  modifier paidEnough(uint _price) {
    require(msg.value >= _price);
    _;
  }

  // Define a modifier that checks the price and refunds the remaining balance
  modifier checkValue(uint _upc) {
    _;
    uint _price = toys[_upc].productPrice;
    uint amountToReturn = msg.value - _price;
    toys[_upc].consumerID.transfer(amountToReturn);
  }

  // Define a modifier that checks if an item.state of a upc is Designed
  modifier designed(uint _upc) {
    require(toys[_upc].itemState == State.Designed);
    _;
  }

  // Define a modifier that checks if an item.state of a upc is approved
  modifier approved(uint _upc) {
    require(toys[_upc].itemState == State.Approved);
    _;
  }

  // Define a modifier that checks if an item.state of a upc is UnderProduction
  modifier underProduction(uint _upc) {
    require(toys[_upc].itemState == State.UnderProduction);
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Packed
  modifier packed(uint _upc) {
    require(toys[_upc].itemState == State.Packed);
    _;
  }

  // Define a modifier that checks if an item.state of a upc is ForSale
  modifier forSale(uint _upc) {
    require(toys[_upc].itemState == State.ForSale);
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Sold
  modifier sold(uint _upc) {
    require(toys[_upc].itemState == State.Sold);
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Shipped
  modifier shipped(uint _upc) {
    require(toys[_upc].itemState == State.Shipped);
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Received
  modifier received(uint _upc) {
    require(toys[_upc].itemState == State.Received);
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Purchased
  modifier purchased(uint _upc) {
    require(toys[_upc].itemState == State.Purchased);
    _;
  }

  // In the constructor set 'owner' to the address that instantiated the contract
  // and set 'sku' to 1
  // and set 'upc' to 1
  constructor() public payable {
    owner = msg.sender;
    sku = 1;
    upc = 1;
  }

  // Define a function 'kill' if required
  function kill() public {
    if (msg.sender == owner) {
      selfdestruct(owner);
    }
  }

  // Define a function 'designToy' that allows a manufacturer to mark an item 'designToy'
  function designToy(uint _upc, address _originManufactureID, string _originManufactureName, string _originManufactureInformation,
     string  _originManufactureLatitude, string  _originManufactureLongitude, string  _productNotes) public
  {
    // Add the new item as part of toys manufactured
    Toy storage newitem = toys[_upc]; //adding a new item to the mapping
    newitem.sku = sku;
    newitem.upc = _upc;
    newitem.originManufactureID = _originManufactureID;
    newitem.originManufactureName = _originManufactureName;
    newitem.originManufactureInformation = _originManufactureInformation;
    newitem.originManufactureLatitude = _originManufactureLatitude;
    newitem.originManufactureLongitude = _originManufactureLongitude;
    newitem.productNotes= _productNotes;
    newitem.itemState = State.Designed;
    newitem.productID = sku+_upc;
    //newitem.productPrice ;
    // Increment sku
    sku = sku + 1;
    // Emit the appropriate event
    emit Designed(sku);
  }

  // Define a function 'prototypeToy' that allows a farmer to mark an item 'Approved'
  function prototypeToy(uint _upc) public
  // Call modifier to check if upc has passed previous supply chain stage
  designed(_upc)
  // Call modifier to verify caller of this function
  onlyOwner
  verifyCaller(owner)
  {
    // Update the appropriate fields
    toys[_upc].itemState = State.Approved;
    // Emit the appropriate event
    emit Approved(_upc);
  }
  // Define a function 'sendToProduction' that allows a farmer to mark an item 'underProduction'
  function sendToProduction(uint _upc) public
  // Call modifier to check if upc has passed previous supply chain stage
  //designed(_upc) 
  approved(_upc)
  // Call modifier to verify caller of this function
  onlyOwner
  verifyCaller(owner)
  {
    // Update the appropriate fields
    toys[_upc].itemState = State.UnderProduction;
    // Emit the appropriate event
    emit UnderProduction(_upc);
  }
  // Define a function 'packToy' that allows a farmer to mark an item 'Packed'
  function packToy(uint _upc) public
  // Call modifier to check if upc has passed previous supply chain stage
  //designed(_upc) approved(_upc) 
  emit UnderProduction(_upc)
  // Call modifier to verify caller of this function
  verifyCaller(owner)
  {
    // Update the appropriate fields
    toys[_upc].itemState = State.Packed;
    // Emit the appropriate event
 emit Packed(_upc);
  }

  // Define a function 'sellToy' that allows a farmer to mark an item 'ForSale'
  function sellToy(uint _upc, uint _price) public
  // Call modifier to check if upc has passed previous supply chain stage
  //designed(_upc) approved(_upc) UnderProduction(_upc)
  packed(_upc)
  // Call modifier to verify caller of this function
  verifyCaller(owner)
  {
    // Update the appropriate fields
    toys[_upc].itemState = State.ForSale;
    // Emit the appropriate event
    emit ForSale(_upc);
  }

  // Define a function 'buyToy' that allows the disributor to mark an item 'Sold'
  // Use the above defined modifiers to check if the item is available for sale, if the buyer has paid enough,
  // and any excess ether sent is refunded back to the buyer
  function buyToy(uint _upc) public payable
    // Call modifier to check if upc has passed previous supply chain stage
    //designed(_upc) approved(_upc) UnderProduction(_upc) 
    packed(_upc)  
    forSale(_upc)
    // Call modifer to check if buyer has paid enough
    paidEnough(msg.value)
    // Call modifer to send any excess ether back to buyer
    checkValue(_upc)
    {

    // Update the appropriate fields - ownerID, distributorID, itemState
    toys[_upc].ownerID = msg.sender;
    toys[_upc].distributorID = msg.sender;
    toys[_upc].itemState = State.Sold;
    // Transfer money to manufacturer

    uint256 toyCost =toys[_upc].productPrice;
    address manufactureAdress = toys[_upc].originManufactureID;
    require(msg.value >toyCost);

    manufactureAdress.transfer(toyCost);
    // emit the appropriate event
    emit Sold(_upc);

  }

  // Define a function 'shipToy' that allows the distributor to mark an item 'Shipped'
  // Use the above modifers to check if the item is sold
  function shipToy(uint _upc) public
    // Call modifier to check if upc has passed previous supply chain stage
    //designed(_upc) approved(_upc) UnderProduction(_upc)   forSale(_upc) 
    sold(_upc) packed(_upc)
    // Call modifier to verify caller of this function
    verifyCaller(owner)
    {
    // Update the appropriate fields
    toys[_upc].itemState = State.Shipped;
    // Emit the appropriate event
    emit Shipped(_upc);
  }

  // Define a function 'receiveToy' that allows the retailer to mark an item 'Received'
  // Use the above modifiers to check if the item is shipped
  function receiveToy(uint _upc) public
    // Call modifier to check if upc has passed previous supply chain stage
    //designed(_upc) approved(_upc) UnderProduction(_upc) packed(_upc)  forSale(_upc) sold(_upc) 
    shipped(_upc)
    // Access Control List enforced by calling Smart Contract / DApp

    {
    // Update the appropriate fields - ownerID, retailerID, itemState
    toys[_upc].ownerID = msg.sender;
    toys[_upc].retailerID = msg.sender;
    toys[_upc].itemState = State.Received;
    // Emit the appropriate event
    emit Received(_upc);

  }

  // Define a function 'purchaseToy' that allows the consumer to mark an item 'Purchased'
  // Use the above modifiers to check if the item is received

  function purchaseToy(uint _upc) public
    // Call modifier to check if upc has passed previous supply chain stage
    //designed(_upc) approved(_upc) UnderProduction(_upc) packed(_upc)  forSale(_upc) sold(_upc) shipped(_upc)  
    received(_upc)
    paidEnough(msg.value)
	checkValue(_upc)
    // Access Control List enforced by calling Smart Contract / DApp
    {
    // Update the appropriate fields - ownerID, consumerID, itemState
    toys[_upc].ownerID = msg.sender;
    toys[_upc].retailerID = msg.sender;
    toys[_upc].itemState = State.Received;

    // Transfer money to manufacturer

    uint256 toyCost =toys[_upc].productPrice;
    address retailerAdress = toys[_upc].retailerID;
    require(msg.value >toyCost);

    retailerAdress.transfer(toyCost);

    // Emit the appropriate event
    emit Purchased(_upc);
  }

  // Define a function 'fetchToyBufferOne' that fetches the data
  function fetchToyBufferOne(uint _upc) public view returns
  (
  uint    itemSKU,
  uint    itemUPC,
  address ownerID,
  address originManufactureID,
  string  originManufactureName,
  string  originManufactureInformation,
  string  originManufactureLatitude,
  string  originManufactureLongitude
  )
  {
  // Assign values to the 8 parameters

  itemSKU = toys[_upc].sku;
  itemUPC = toys[_upc].upc;
  ownerID = toys[_upc].ownerID;
  originManufactureID = toys[_upc].originManufactureID;
  originManufactureName = toys[_upc].originManufactureName;
  originManufactureInformation = toys[_upc].originManufactureInformation;
  originManufactureLatitude = toys[_upc].originManufactureLatitude;
  originManufactureLongitude = toys[_upc].originManufactureLongitude;

  return
  (
  itemSKU,
  itemUPC,
  ownerID,
  originManufactureID,
  originManufactureName,
  originManufactureInformation,
  originManufactureLatitude,
  originManufactureLongitude
  );
  }

  // Define a function 'fetchToyBufferTwo' that fetches the data
  function fetchToyBufferTwo(uint _upc) public view returns
  (
  uint    itemSKU,
  uint    itemUPC,
  uint    productID,
  string  productNotes,
  uint    productPrice,
  Stare    itemState,
  address distributorID,
  address retailerID,
  address consumerID
  )
  {
    // Assign values to the 9 parameters
    itemSKU = toys[_upc].sku;
    itemUPC = toys[_upc].upc;
    productID = toys[_upc].productID;
    productNotes = toys[_upc].productNotes;
    productPrice = toys[_upc].productPrice;
    itemState = toys[_upc].itemState;
    distributorID = toys[_upc].distributorID;
    retailerID = toys[_upc].retailerID;
    consumerID = toys[_upc].consumerID;

  return
  (
  itemSKU,
  itemUPC,
  productID,
  productNotes,
  productPrice,
  itemState,
  distributorID,
  retailerID,
  consumerID
  );
  }
}
