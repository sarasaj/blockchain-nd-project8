
#contract address : rinkey.txt file
#libraries : libraries.txt file
#IPFS : IPFS file
# Program version numbers : 0.1 \\ solidity ^0.4.24;
#node version number : v8.9.1
#Truffle version number :
Truffle v4.1.15 (core: 4.1.15)
Solidity v0.4.25 (solc-js)
#web3 version number: 1.0.0-beta.48

#how to compile and test the project 
## 1.0 start ganache and add a new workspace for truffle project 
1.1 make sure the portal in the truffle.config file is set to 7454 like ganache 
also change the menomic the one givi=en by ganache

## 2 cd to the project-6 folder in sifde the project directory
example:

cd C:\Users\UserName\Documents\GitHub\blockchain-nd-project8\nd1309-Project-6b-Example-Template-master\project-6

## 3 type in you terminal/command line
###3.0 : npm install ..to install all requisite npm packages
###3.1 : truffle.cmd compile 
###3.2 : truffle.cmd migrate --reset
###3.3 : truffle.cmd test .. to test the files 

##4 run "run npm dev" in a diffrent terminal to see the frontend


#project folder struture 
#go to documantation files folder and yoú will find :
## 1 UML diagrams 
## 2 libraries 
## 3 ipfs 
## 4 contracts addresses in rinkeby

#AccessControl
Contains a class for each role and controls the access for each one separately

the 4 actors in the supply chain are:
## manufacturer:
 The manufacturer can design toy, make a prototype for it, send it to production, does quality inspection, pack toy, ship toy, add toy, and track authenticity.
## Distributor:
 The Distributor can buy toy store toy in Ware House and track authenticity.
## Retailer:
 The Retailer can receive toy and track authenticity.
## Consumer:
 The consumer can buy toy and track authenticity.
