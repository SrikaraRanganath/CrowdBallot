import web3 from './web3';
import BallotFactory from './build/BallotFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(BallotFactory.interface),
    '0xFD870b445D811fA8CE379429c94dbb5ffF0021B8'
    );

export default instance;