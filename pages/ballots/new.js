import React,{ Component } from 'react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import { Router } from '../../routes';

class BallotNew extends Component{
    state= {
        securityDeposit: '',
        ballotName: '',
        errorMessage: '',
        loading: false
    }

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({
            errorMessage: '',
            loading: true
        });
        
        try{
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createBallot(this.state.ballotName, this.state.securityDeposit).send({
                from: accounts[0]
            });
            Router.pushRoute('/');
        } catch(err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({ loading: false });
    }




    render() {
        return (
            <Layout>
                <h3>Create a new Ballot!</h3>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} >
                    <Message error header="Oops ,Something went Wrong!" content={this.state.errorMessage} />
                    <Form.Field>
                        <label>Security Deposit </label>
                        <Input 
                        label='wei'
                        labelPosition='right'
                        value={this.state.securityDeposit}
                        onChange={ event => this.setState({ securityDeposit: event.target.value }) }
                        size='large'
                        /> 
                    </Form.Field>

                    <Form.Field>
                        <label>Ballot Name </label>
                        <Input 
                        value={this.state.ballotName}
                        onChange={event => this.setState({ ballotName: event.target.value }) }
                        size='large'
                        />
                    </Form.Field>
                    
                    <Button loading={this.state.loading} primary >Create</Button>
                </Form>

            </Layout>
        );
    }
}

export default BallotNew;