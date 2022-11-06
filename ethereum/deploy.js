const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledBallot = require('./build/BallotFactory.json');

const provider = new HDWalletProvider(
    'cruise crumble curve unknown base current quiz shrug that doctor divorce wealth',
    'https://rinkeby.infura.io/v3/9a3a56418d7d4b1a8cca09c4e89f2380'
);

const web3 = new Web3(provider);

const deploy = async() => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account ',accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compiledBallot.interface))
        .deploy({ data: compiledBallot.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    console.log('Contract deployed to ',result.options.address);
    provider.engine.stop();
}
deploy();