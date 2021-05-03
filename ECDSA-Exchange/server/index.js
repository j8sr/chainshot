const express = require('express');
const app = express();
const cors = require('cors');
const EC = require('elliptic').ec;
const port = 3042;

// Create and initialize EC context
const ec = new EC('secp256k1');

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

const publicKeys = [];
const privTable = [];

for (let i = 0; i < 3; i++) {
    const key = ec.genKeyPair();

    // encode the entire public key as a hexadecimal string
    publicKeys[i] = key.getPublic().encode('hex');

    // make lookup table from toString private key to true private keys
    privTable[key.getPrivate().toString(16)] = key;

    console.log("Public: " + publicKeys[i] + "\nPrivate: " + key.getPrivate().toString(16) + "\n");
}

const balances = {};

balances[publicKeys[0]] = 100;
balances[publicKeys[1]] = 50;
balances[publicKeys[2]] = 75;

function printBalances() {
    console.log(balances);
}

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
  printBalances();
});

app.post('/send', (req, res) => {
  const {sender, privateKey, recipient, amount} = req.body;

  // check if we were sent a valid private key
  if (!privTable[privateKey]) {
    console.log("INVALID PRIVATE KEY");
    return;
  }

  const key = privTable[privateKey];

  // check if the private key matches the public key
  if (sender != key.getPublic().encode('hex')) {
    console.log("PRIVATE KEY DOES NOT MATCH PUBLIC KEY");
    return;
  }

  const signature = key.sign(amount.toString());
  const derSign = signature.toDER();

  // check if this successfully can sign the ammount
  if (!key.verify(amount.toString(), derSign)) {
    console.log("FAILED TO SUCCESSFULLY SIGN");
    return;
  }


  if (balances[sender] - amount < 0) {
    console.log("INSUFFICIENT FUNDS");
    return;
  }

  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
  printBalances();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
