import web3 from './web3';
import Ballot from './build/Ballot.json';

const ballot = (address) => {   
    return new web3.eth.Contract(
        JSON.parse(Ballot.interface), 
        address
    );
}

export default ballot;