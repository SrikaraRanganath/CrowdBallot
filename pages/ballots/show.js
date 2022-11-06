import React,{ Component } from 'react';
import Layout from '../../components/Layout';
import Ballot from '../../ethereum/ballot';
import { Link } from '../../routes';
import web3 from '../../ethereum/web3';
import { Card,Button,Grid,Confirm, Message, Accordion, Icon  } from 'semantic-ui-react';
import { Router } from '../../routes';
import FinalizeBallot from '../../components/finalizeBallot';

class BallotShow extends Component {    
    state = {
        open: false,
        loading: false,
        errorMessage: '',
        hidden: true,
        positive: true,
        error: false,
        header: '',
        content: '',
        activeIndex: 0,
        approveState: false
    };


    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
    
        this.setState({ activeIndex: newIndex })
    }

    show = () => {
        this.setState({ open: true });
    }
    handleCancel = () => {
        this.setState({open:false, errorMessage: '', hidden: true});
    }
    handleConfirm = async () => {
        this.setState({open:false, loading: true, hidden: true});
        const accounts = await web3.eth.getAccounts();
        const ballot = Ballot(this.props.address);
        try{
            await ballot.methods.register().send({
                from: accounts[0]
            });
            this.setState({loading: false, positive: true, error:false , hidden: false, header: 'Your user registration was successful', content: 'You can cast a vote to any candidate contending.'});
        } catch( err ) {
            this.setState({ content: err.message, error: true,hidden: false, header: 'Oops! Something Went Wrong', loading: false });
        }
        Router.pushRoute(`/ballots/${this.props.address}/`);
    }
    
    static async getInitialProps(props) {
        const ballot = Ballot(props.query.address);
        const summary = await ballot.methods.getSummary().call();
        const accounts = await web3.eth.getAccounts();
        const status = await ballot.methods.getBallotStatus().call();
        const ballotWinner = await ballot.methods.getWinnerDetails().call();
        return {
            address: props.query.address,
            manager: summary[0],
            ballotName: summary[1],
            candidatesCount: summary[2],
            votersCount: summary[3],
            account: accounts[0],
            status: status,
            winner: ballotWinner
        };
    }


    renderCards = () => {
        const { 
            manager,
            ballotName,
            candidatesCount,
            votersCount,
            status,
            winner
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Address of the Manager',
                description: 'The manager created this ballot and can finalise the election.',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: ballotName,
                meta: 'Name of the Election',
                description: 'The Name of the Election being contested.'
            },
            {
                header: candidatesCount,
                meta: 'Number of Candidates',
                description: 'Total Number of Candidates Contesting the Election.'
            },
            {
                header: votersCount,
                meta: 'Number of Voters',
                description: 'Total Number of Registeres Voters.'
            },
            {
                header: ( status ? 'Complete' : 'Ongoing'),
                meta: 'Ballot Status',
                description: 'Status of the Deployed Ballot. Complete/ Ongoing',
                color: ( status ? 'green' : 'red' )
            },
            {
                header: ( !!winner && status ? winner : 'Waiting to Finalize'),
                meta: 'Ballot Winner',
                description: 'The Candidate who Won The Ballot with respect to Votes.',
                color: ( status ? 'green' : 'red' )
            }
        ];

        return <Card.Group items={items} />

    }



    render() {
        return (    
            <Layout>
                <h3>Ballot Details</h3>
                <Message hidden={this.state.hidden} positive={this.state.positive} error={this.state.error} style={{overflowWrap:'break-word'}} >
                    <Message.Header>{this.state.header}</Message.Header>
                    <p>{this.state.content}</p>
                </Message>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={13} >
                            {this.renderCards()}
                        </Grid.Column>

                        <Grid.Column width={3}>
                            { this.props.status ? null :(
                            <Grid.Row style={{marginBottom: '15px'}}>
                            <Link route={`/ballots/${this.props.address}/candidate`} >
                                <a>
                                    <Button color='teal' size='large' fluid> 
                                    Register As a Candidate  
                                    </Button>
                                </a>
                            </Link>
                            </Grid.Row>)
                            }
                            { this.props.status ? null : (
                            <Grid.Row style={{ marginBottom: '15px' }} >
                                <Button primary size='large' fluid onClick={this.show} loading={this.state.loading} >
                                    Register to Cast a Vote
                                </Button>
                                <Confirm
                                open={this.state.open}
                                header='Are you sure ?'
                                content='Please Click OK if you want to register to Cast a Vote!'
                                onCancel={this.handleCancel}
                                onConfirm={this.handleConfirm}
                                />
                            </Grid.Row>)
                            }
                        </Grid.Column>
                        
                    </Grid.Row>
                        <Grid.Column width={16}>
                            { this.props.manager.toString()  == this.props.account && !this.props.status ? <FinalizeBallot address={this.props.address} /> : null  }
                        </Grid.Column>
                    <Grid.Row>
                         
                    </Grid.Row>

                    <Grid.Row>
                        
                        <h3>How to Cast Your Vote?</h3>
                        <Accordion styled fluid>
                        <Accordion.Title
                        active={this.state.activeIndex === 0}
                        index={0}
                        onClick={this.handleClick}
                        >
                            <Icon name='dropdown' />
                            Step 1: Eligibility
                            </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndex === 0}>
                        <p>
                            Firstly ,you need to be an eligible to cast a vote. One can become <b>eligible</b> by registering before the ballot is 
                            finalised by the manager.
                        </p>
                        </Accordion.Content>

                        <Accordion.Title
                        active={this.state.activeIndex === 1}
                        index={1}
                        onClick={this.handleClick}
                        >
                        <Icon name='dropdown' />
                        Step 2: Register
                        </Accordion.Title>
                        <Accordion.Content active={this.state.activeIndex === 1}>
                        <p>
                            You can register yourself by clicking on the button above. Please note that you can cast your vote only once.
                        </p>
                        </Accordion.Content>

                        <Accordion.Title
                        active={this.state.activeIndex === 2}
                        index={2}
                        onClick={this.handleClick}
                        >
                        <Icon name='dropdown' />
                        Step 3: Cast your Vote
                        </Accordion.Title>
                        <Accordion.Content active={this.state.activeIndex === 2}>
                        <p>
                            Once you have registered yourself, you can click on the link below to cast your vote.
                        </p>
                        <p>
                            {   
                            this.props.status ? <strong>Ballot has Already Been Finalized</strong> :
                            (<Link route={`/ballots/${this.props.address}/castvote`} >
                            <Button primary>
                                Cast Your Vote
                                <Icon name='right arrow' />
                            </Button>
                            </Link>)
                            }
                        </p>
                        </Accordion.Content>
                        </Accordion>
                    </Grid.Row>
                
                </Grid>
            </Layout>
        );
    }
}

export default BallotShow;