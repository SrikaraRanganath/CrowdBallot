import Web3 from 'web3';

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    window.ethereum.request({
        method: "eth_requestAccounts"
    });
    web3 = new Web3(window.ethereum);
}

else {
    const provider = new Web3.providers.HttpProvider(
        "https://rinkeby.infura.io/v3/9a3a56418d7d4b1a8cca09c4e89f2380"
    );
    web3 = new Web3(provider);
}

export default web3;