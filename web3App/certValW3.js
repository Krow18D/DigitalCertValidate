const Web3 = require('web3');
const jsSHA = require("jssha");
const fs = require("fs");

let web3 = undefined;
let contract = undefined;

function init () {
  //set up network
  let provider = new Web3.providers.HttpProvider("http://localhost:7545");
  web3 = new Web3(provider);

  //contract abi
  let abi = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "hash",
          "type": "string"
        }
      ],
      "name": "addDocHash",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "hash",
          "type": "string"
        }
      ],
      "name": "findDocHash",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        },
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "hash",
          "type": "string"
        }
      ],
      "name": "toggleStatus",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  //asign contract address
  let address = "0xFf3F8Ca0AaF90Bf7c2c3743A13f3B4a2682CAaec";

  //init contract
  contract = new web3.eth.Contract(abi, address);
};

//get a SHA-256 hash from a file --> works synchronously
function calculateHash (fileName) {
  let fileContent = fs.readFileSync(fileName);
  return calculateHashBytes(fileContent);
};

//get a SHA-256 hash from a data Buffer --> works synchronously
function calculateHashBytes (data) {
  let  shaObj = new jsSHA("SHA-512", "ARRAYBUFFER");
  shaObj.update(data);
  let hash = "0x" + shaObj.getHash("HEX");
  return hash;
};

//sends a hash to the blockchain
function sendHash (hash, callback) {
    web3.eth.getAccounts(function (error, accounts) {
      contract.methods.addDocHash(hash).send({
        from: accounts[0]
      },function(error, tx) {
        if (error) callback(error, null);
        else callback(null, tx);
      });
    });
};

//looks up a hash on the blockchain
function findHash (hash, callback) {
  contract.methods.findDocHash(hash).call( function (error, result) {
    if (error) callback(error, null);
    else {
      let resultObj = {
        status: result[0],
        adderPub: result[1],
        mineTime:  new Date(result[2] * 1000),
        blockNumber: result[3]
      }
      callback(null, resultObj);
    }
  });
};

function toggleCert (hash, callback) {
  web3.eth.getAccounts(function (error, accounts) {
    contract.methods.toggleStatus(hash).send({
      from: accounts[0]
    },function(error, tx) {
      if (error) callback(error, null);
      else callback(null, tx);
    });
  });
};

let certValExports = {
  findHash : findHash,
  sendHash : sendHash,
  calculateHash : calculateHash,
  init : init,
  calculateHashBytes : calculateHashBytes,
  toggleCert : toggleCert,
};

module.exports = certValExports;