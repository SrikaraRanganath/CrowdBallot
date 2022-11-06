import React, { Component } from 'react';
import { Card, Button, Message } from 'semantic-ui-react';
import Ballot from '../ethereum/ballot';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class finalizeBallot extends Component{

    state = {
        loading: false,
        header: 'Ballot Finalization Succesfull',
        message: 'Succesfully Finalized the Ballot',
        hidden: true
    }

    onApprove = async() => {
        const ballot = Ballot(this.props.address);
        const accounts = await web3.eth.getAccounts();
        try{
            this.setState({ loading: true, hidden:true});
            await ballot.methods.finalizeBallot().send({
            from: accounts[0]
        });
            this.setState({loading: false});
            Router.pushRoute(`/ballots/${this.props.address}`); 
        } catch ( err) {
            this.setState({ loading: false, message: err.message, hidden:false, header:'Oops! Something Went Wrong' });
        }
    }

    render() {
        return (
            <div>
            <Message error hidden={this.state.hidden} >
                <Message.Header>{this.state.header}</Message.Header>
                <p>{this.state.message}</p>
            </Message>
            <Card fluid>
                <Card.Content>
                    <Card.Header>Finalise the Ballot</Card.Header>
                        <Card.Meta>Pick the Winner of the electoral Ballot!</Card.Meta>
                            <Card.Description>
                                Once you click on Finalise. The contract will pick the <strong>Winner of the Electoral Ballot</strong>
                            </Card.Description>
                </Card.Content>    
                <Card.Content extra>
                    <div className='ui two buttons'>
                        <Button basic color='green' onClick={this.onApprove} loading={this.state.loading} >
                            Approve
                        </Button>
                    </div>
                </Card.Content>
            </Card>
            </div>
        );
    }

}


export default finalizeBallot;