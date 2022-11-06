pragma solidity ^0.4.17;

contract BallotFactory {
    address[] public deployedBallots;

    function createBallot(string ballotName,uint securityDeposit) public {
        address newBallot = new Ballot(ballotName,securityDeposit,msg.sender);
        deployedBallots.push(newBallot);
    }

    function getDeployedBallots() public view returns(address[]) {
        return deployedBallots;
    }
}

contract Ballot{ 
    address public manager;
    string public ballotName;
    struct Candidate{
        string name;
        string party;
        uint256 age;
        uint256 voteCount; 
    }
    Candidate[] public candidates;
    mapping(address => bool) voters;
    mapping(address => bool) castedVote;
    mapping(address => bool) candidateAddresses;    
    uint256 public votersCount;
    uint256 securityDeposit;
    uint256 winnerIndex = 0;
    bool complete = false;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Ballot(string name,uint deposit,address creator) public {
        ballotName = name;
        manager = creator;
        securityDeposit = deposit;
    }

    function contest(string name, string party, uint age) public payable {
        require(!complete);
        require(msg.value == securityDeposit);
        require(!candidateAddresses[msg.sender]);
        candidateAddresses[msg.sender] = true;
        Candidate memory newCandidate = Candidate({
            name: name,
            party: party,
            age: age,
            voteCount: 0
        });

        candidates.push(newCandidate);
    }

    function register() public {
        require(!complete);
        require(!voters[msg.sender]);
        voters[msg.sender] = true;
        castedVote[msg.sender] = false;
        votersCount++;
    }

    function castVote(uint index) public {
        require(voters[msg.sender]);
        require(!castedVote[msg.sender]);
        require(!complete);

        Candidate storage candidate = candidates[index];
        candidate.voteCount++;
        castedVote[msg.sender] = true;
    }

    function finalizeBallot() public restricted {
        uint highest = candidates[0].voteCount;
        uint pos = 0;
        for(uint index = 1; index < candidates.length; index++){
            if(candidates[index].voteCount > highest) {
                highest = candidates[index].voteCount;
                pos = index;
            }
        }
        winnerIndex = pos;
        complete = true;
    }

    function getSummary() public view returns(address,string,uint,uint) { 
        return (
            manager,
            ballotName,
            candidates.length,
            votersCount
        );  
    }

    function getCandidatesCount() public view returns(uint) {
        return candidates.length;
    }

    function getUserAddress() public view returns(address) {
        return msg.sender;
    }

    function getBallotStatus() public view returns(bool) {
        return complete;
    }

    function getWinnerDetails() public view returns(string) {
        if(!complete) {
            return "Waiting to Finalize";
        }
        return candidates[winnerIndex].name;
    }

    function getCastedVoteStatus() public view returns(bool) {
       return castedVote[msg.sender];
    }

}
