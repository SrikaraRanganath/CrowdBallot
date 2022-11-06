import React,{ Component } from 'react';
import Ballot from '../ethereum/ballot';
import { Table, Button, Modal, Header } from 'semantic-ui-react';
import web3 from '../ethereum/web3';

class CandidateRow extends Component {
    
    state = {
        loading: false,
        errorMessage: '',
        open: false
    }

    checkCastedVote = async () => {
        const ballot = Ballot(this.props.address);
        const status = await ballot.methods.getCastedVoteStatus().call();
        console.log(status);
        return status;
    }

    onCast = async () => {
        try{
            this.setState({loading: true});
            const ballot = Ballot(this.props.address);
            const accounts = await web3.eth.getAccounts();
            await ballot.methods.castVote(this.props.id).send({ from: accounts[0] });
            this.setState({loading: false});
        } catch( err ) {
            this.setState({ errorMessage: err.message, loading:false });
        }
        
    }
    
    
    render() {
        const { Row, Cell } = Table;
        const {id,candidate} = this.props;
        return (
            <Row>
                <Cell>{id}</Cell>
                <Cell>{candidate.name}</Cell>
                <Cell>{candidate.party}</Cell>
                <Cell>{candidate.age}</Cell>
                <Cell>
                
                <Modal
                onClose={() => this.setState({open: false})}
                onOpen={() => this.setState({open: true})}
                open={this.state.open}
                trigger={<Button color='teal' size='large' loading={this.state.loading} disabled={this.checkCastedVote}>Cast</Button>}
                >
                <Modal.Header>Are you sure ?</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                    <Header>Cast a vote to {candidate.name}</Header>
                    <p>
                        Do you wish to Cast a vote to the above candidate. Once you cast a vote, you cannot revert it. 
                    </p>
        
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => this.setState({open: false})}>
                    Nope
                    </Button>
                    <Button
                    content="Yep, go ahead"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => {
                        this.setState({open: false})
                        this.onCast()
                    }}
                    positive
                    />
                </Modal.Actions>
                </Modal>
                    
                </Cell>
            </Row>
            
        );
    }
}

export default CandidateRow;