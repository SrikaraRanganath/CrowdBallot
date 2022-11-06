import React,{ Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Ballot from '../ethereum/ballot';
import web3 from '../ethereum/web3';
import { Router,Link } from '../routes';

class CandidateForm extends Component {
    
    state = {
        loading: false,
        errorMessage: '',
        candidateName: '',
        candidateParty: '',
        candidateAge: ''
    };


    onSubmit = async(event) => {
        event.preventDefault();
        
        try{
            const ballot = Ballot(this.props.address);
            this.setState({ loading: true, errorMessage:'' });
            const accounts = await web3.eth.getAccounts(); 
            await ballot.methods.contest(this.state.candidateName, this.state.candidateParty, parseInt(this.state.candidateAge)).send({
                from: accounts[0],
                value: '100'
            });
            Router.replaceRoute(`/ballots/${this.props.address}`)
        }catch (err) {
            this.setState({ loading: false, errorMessage: err.message });
        }
        this.setState({ loading: false, candidateName: '', candidateParty: '', candidateAge: '' });
    }
    
    render() {
        return (
                <div>
                <h1>Register As A Candidate</h1>
                <Link route={`/ballots/${this.props.address}`}>
                    <Button basic size='medium' style={{marginBottom: '15px'}} color='black' >Back</Button>
                </Link>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} >
                    <Message error header='Oops! Something Went Wrong' content={this.state.errorMessage} />
                    <Form.Field>
                        <label>Enter your Name</label>
                        <Input
                        value={this.state.candidateName}
                        onChange={event => this.setState({ candidateName: event.target.value }) }
                        size='large'
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Enter your Political Party</label>
                        <Input 
                        value={this.state.candidateParty}
                        onChange={ event => this.setState({ candidateParty: event.target.value }) }
                        size='large'
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Enter your age</label>
                        <Input 
                        value={this.state.candidateAge}
                        onChange={ event => this.setState({ candidateAge: event.target.value }) }
                        size='large'
                        />
                    </Form.Field>

                    <Button primary loading={this.state.loading} size='large'>Submit</Button>
                </Form>
                </div>
           
        );
    }
}

export default CandidateForm;