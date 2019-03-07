// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var ToyBase = artifacts.require('ToyBase')

contract('ToyBase', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1
    var upc = 1
    const ownerID = accounts[0]
    const originManufacturerID = accounts[1]
    const originManufacturerName = "sara's toys"
    const originManufacturerInformation = "jeddah Valley"
    const originManufacturerLatitude = "-38.239770"
    const originManufacturerLongitude = "144.341490"
    var productID = sku + upc
    const productNotes = "Best toys for kids"
    const productPrice = web3.toWei(1, "ether")
    var itemState = 0
    const distributorID = accounts[2]
    const retailerID = accounts[3]
    const consumerID = accounts[4]
    const emptyAddress = '0x00000000000000000000000000000000000000'

    ///Available Accounts
    ///==================
    ///(0) 0x27d8d15cbc94527cadf5ec14b69519ae23288b95
    ///(1) 0x018c2dabef4904ecbd7118350a0c54dbeae3549a
    ///(2) 0xce5144391b4ab80668965f2cc4f2cc102380ef0a
    ///(3) 0x460c31107dd048e34971e57da2f99f659add4f02
    ///(4) 0xd37b7b8c62be2fdde8daa9816483aebdbd356088
    ///(5) 0x27f184bdc0e7a931b507ddd689d76dba10514bcb
    ///(6) 0xfe0df793060c49edca5ac9c104dd8e3375349978
    ///(7) 0xbd58a85c96cc6727859d853086fe8560bc137632
    ///(8) 0xe07b5ee5f738b2f87f88b99aac9c64ff1e0c7917
    ///(9) 0xbd3ff2e3aded055244d66544c9c059fa0851da44

    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Manufacturer: accounts[1] ", accounts[1])
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Retailer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])

    // 1st Test
    it("Testing smart contract function designToy() that allows a maufacturer to design toy", async() => {
        const toyBase = await ToyBase.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Harvested()
        var event = toyBase.Designed()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Designed by calling function designToy()
        await toyBase.designToy(upc, originManufacturerID, originManufacturerName, originManufacturerInformation, originManufacturerLatitude, originManufacturerLongitude, productNotes)

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await toyBase.fetchToyBufferOne.call(upc)
        const resultBufferTwo = await toyBase.fetchToyBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], 2, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originManufacturerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originManufacturerID, 'Error: Missing or Invalid originManufacturerID')
        assert.equal(resultBufferOne[4], originManufacturerName, 'Error: Missing or Invalid originManufacturerName')
        assert.equal(resultBufferOne[5], originManufacturerInformation, 'Error: Missing or Invalid originManufacturerInformation')
        assert.equal(resultBufferOne[6], originManufacturerLatitude, 'Error: Missing or Invalid originManufacturerLatitude')
        assert.equal(resultBufferOne[7], originManufacturerLongitude, 'Error: Missing or Invalid originManufacturerLongitude')
        assert.equal(resultBufferTwo[5], 0, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')        
    })    

    // // 2nd Test
    it("Testing smart contract function prototypeToy() that allows a Manufacturer to make an aprroved prototype out of the designed toy", async() => {
        const toyBase = await ToyBase.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Approved()
        var event = toyBase.Approved()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Processed by calling function processtItem()
        await toyBase.prototypeToy(upc)

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await toyBase.fetchToyBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 1, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted') 
    })    

    // // 3rd Test
    it("Testing smart contract function sendToProduction() that allows a Manufacturer send toy to production", async() => {
        const toyBase = await ToyBase.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event UnderProduction()
        var event = toyBase.UnderProduction()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Processed by calling function processtItem()
        await toyBase.sendToProduction(upc)

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await toyBase.fetchToyBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 2, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted') 
    }) 
    // 4th Test 
    it("Testing smart contract function packToy() that allows a Manufacturer to pack toy", async() => {
        const toyBase = await ToyBase.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event UnderProduction()
        var event = toyBase.Packed()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Processed by calling function processtItem()
        await toyBase.packToy(upc)

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await toyBase.fetchToyBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 3, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted') 
        
    })    

    // // 5th Test
    it("Testing smart contract function sellToy() that allows a Manufacturer to sell toys", async() => {
        const toyBase = await ToyBase.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event UnderProduction()
        var event = toyBase.ForSale()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Processed by calling function processtItem()
        await toyBase.sellToy(upc,productPrice)

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await toyBase.fetchToyBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid product price')
        assert.equal(resultBufferTwo[5], 4, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted') 
          
    })    

    // // 6th Test
    it("Testing smart contract function buyToy() that allows a distributor to buy toy", async() => {
        const toyBase = await ToyBase.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event UnderProduction()
        var event = toyBase.Sold()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Processed by calling function processtItem()
        await toyBase.buyToy(upc, {from: distributorID ,value: productPrice})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await toyBase.fetchToyBufferOne.call(upc)
        const resultBufferTwo = await toyBase.fetchToyBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferTwo[5], 5, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributorID')
        assert.equal(eventEmitted, true, 'Invalid event emitted') 
        
    })    

    // // 7th Test
    it("Testing smart contract function shipToy() that allows a distributor to ship a toy", async() => {
        const toyBase = await ToyBase.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event UnderProduction()
        var event = toyBase.Shipped()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Processed by calling function processtItem()
        await toyBase.shipToy(upc)

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await toyBase.fetchToyBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 6, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted') 
              
    })    

    // // 8th Test
    it("Testing smart contract function receiveToy() that allows a retailer to mark toy received", async() => {
        const toyBase = await ToyBase.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event UnderProduction()
        var event = toyBase.Received()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Processed by calling function processtItem()
        await toyBase.receiveToy(upc, {from: retailerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await toyBase.fetchToyBufferOne.call(upc)
        const resultBufferTwo = await toyBase.fetchToyBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], retailerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferTwo[5], 7, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Invalid retailerID')
        assert.equal(eventEmitted, true, 'Invalid event emitted') 
             
    })    

    // // 9th Test
    it("Testing smart contract function purchaseToy() that allows a consumer to purchase toys", async() => {
        const toyBase = await ToyBase.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event UnderProduction()
        var event = toyBase.Purchased()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Processed by calling function processtItem()
        await toyBase.purchaseToy(upc, {from: consumerID ,value: productPrice})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await toyBase.fetchToyBufferOne.call(upc)
        const resultBufferTwo = await toyBase.fetchToyBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferTwo[5], 8, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[8], consumerID, 'Error: Invalid consumerID')
        assert.equal(eventEmitted, true, 'Invalid event emitted') 
        
    })    

    // // 10th Test
    it("Testing smart contract function fetchToymBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        const toyBase = await ToyBase.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        
        const resultBufferOne = await toyBase.fetchToyBufferOne.call(upc)

        // Verify the result set:
        assert.equal(resultBufferOne[0], 2, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originManufacturerID, 'Error: Missing or Invalid originManufacturerID')
        assert.equal(resultBufferOne[4], originManufacturerName, 'Error: Missing or Invalid originManufacturerName')
        assert.equal(resultBufferOne[5], originManufacturerInformation, 'Error: Missing or Invalid originManufacturerInformation')
        assert.equal(resultBufferOne[6], originManufacturerLatitude, 'Error: Missing or Invalid originManufacturerLatitude')
        assert.equal(resultBufferOne[7], originManufacturerLongitude, 'Error: Missing or Invalid originManufacturerLongitude')
      
    })

    // // 11th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
        const toyBase = await ToyBase.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        
        const resultBuffertwo = await toyBase.fetchToyBufferTwo.call(upc)

        // Verify the result set:
        assert.equal(resultBuffertwo[0], 2, 'Error: Invalid item SKU')
        assert.equal(resultBuffertwo[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBuffertwo[2], productID, 'Error: Missing or Invalid productID')
        assert.equal(resultBuffertwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBuffertwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBuffertwo[5], 8, 'Error: Missing or Invalid itemState')
        assert.equal(resultBuffertwo[6], distributorID, 'Error: Missing or Invalid distributorID')
        assert.equal(resultBuffertwo[7], retailerID, 'Error: Missing or Invalid retailerID')
        assert.equal(resultBuffertwo[8], consumerID, 'Error: Missing or Invalid consumerID')
        
    })

});

