App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originManufacturerID: "0x0000000000000000000000000000000000000000",
    originManufacturerName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originManufacturerID = $("#originManufacturerID").val();
        App.originManufacturerName = $("#originManufacturerName").val();
        App.originManufacturerInformation = $("#originManufacturerInformation").val();
        App.originManufacturerLatitude = $("#originManufacturerLatitude").val();
        App.originManufacturerLongitude = $("#originManufacturerLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.distributorID = $("#distributorID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();

        console.log(
            App.sku,
            App.upc,
            App.ownerID, 
            App.originManufacturerID, 
            App.originManufacturerName, 
            App.originManufacturerInformation, 
            App.originManufacturerLatitude, 
            App.originManufacturerLongitude, 
            App.productNotes, 
            App.productPrice, 
            App.distributorID, 
            App.retailerID, 
            App.consumerID
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetaskAccountID();

        return App.initToyBase();
    },


    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initToyBase: function () {
        /// Source the truffle compiled smart contracts
        var jsonToyBase='../../build/contracts/ToyBase.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonToyBase, function(data) {
            console.log('data',data);
            var ToyBaseArtifact = data;
            App.contracts.ToyBase = TruffleContract(ToyBaseArtifact);
            App.contracts.ToyBase.setProvider(App.web3Provider);
            
            App.fetchToyBufferOne();
            App.fetchToyBufferTwo();
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.designToy(event);
                break;
            case 2:
                return await App.prototypeToy(event);
                break;
            case 3:
                return await App.sendToProduction(event);
                break;
            case 4:
                return await App.packToy(event);
                break;
            case 5:
                return await App.sellToy(event);
                break;
            case 6:
                return await App.buyToy(event);
                break;
            case 7:
                return await App.shipToy(event);
                break;
            case 8:
                return await App.receiveToy(event);
                break;
            case 9:
                return await App.purchaseToy(event);
                break;
            case 10:
                return await App.fetchToyBufferOne(event);
                break;
            case 11:
                return await App.fetchToyBufferTwo(event);
                break;
            }
    },

    designToy: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.ToyBase.deployed().then(function(instance) {
            return instance.designToy(
                App.upc, 
                App.metamaskAccountID, 
                App.originManufacturerName, 
                App.originManufacturerInformation, 
                App.originManufacturerLatitude, 
                App.originManufacturerLongitude, 
                App.productNotes
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('designToy',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    prototypeToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.ToyBase.deployed().then(function(instance) {
            return instance.prototypeToy(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('prototypeToy',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    sendToProduction: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.ToyBase.deployed().then(function(instance) {
            return instance.sendToProduction(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sendToProduction',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },
    
    packToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.ToyBase.deployed().then(function(instance) {
            return instance.packToy(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('packToy',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    sellToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.ToyBase.deployed().then(function(instance) {
            const productPrice = web3.toWei(1, "ether");
            console.log('productPrice',productPrice);
            return instance.sellToy(App.upc, App.productPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sellToy',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    buyToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.ToyBase.deployed().then(function(instance) {
            const walletValue = web3.toWei(3, "ether");
            return instance.buyToy(App.upc, {from: App.metamaskAccountID, value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('buyToy',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    shipToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.ToyBase.deployed().then(function(instance) {
            return instance.shipToy(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('shipToy',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    receiveToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.ToyBase.deployed().then(function(instance) {
            return instance.receiveToy(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('receiveToy',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    purchaseToy: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.ToyBase.deployed().then(function(instance) {
            const walletValue = web3.toWei(3, "ether");
            return instance.purchaseToy(App.upc, {from: App.metamaskAccountID, value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('purchaseToy',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchToyBufferOne: function () {
       event.preventDefault();
       var processId = parseInt($(event.target).data('id'));

        App.upc = $('#upc').val();
        console.log('upc',App.upc);

        App.contracts.ToyBase.deployed().then(function(instance) {
          return instance.fetchToyBufferOne(App.upc);
        }).then(function(result) {
            $("#display").text('');
            for ( var key in result ) {
                if ( !result.hasOwnProperty(key) ) continue;
                $("#display").append('<li>' + result[key] + '</li>');
            }
          console.log('fetchToyBufferOne', result);
          //console.table(result)
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchToyBufferTwo: function () {
       event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
                        
        App.contracts.ToyBase.deployed().then(function(instance) {
          return instance.fetchToyBufferTwo.call(App.upc);
        }).then(function(result) {
                $("#display").text('');

          for ( var key in result ) {
                if ( !result.hasOwnProperty(key) ) continue;
                $("#display").append('<li>' + result[key] + '</li>');
            }
          console.log('fetchToyBufferTwo', result);
          //console.table(result)
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.ToyBase.currentProvider.sendAsync !== "function") {
            App.contracts.ToyBase.currentProvider.sendAsync = function () {
                return App.contracts.ToyBase.currentProvider.send.apply(
                App.contracts.ToyBase.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.ToyBase.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });
        
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
