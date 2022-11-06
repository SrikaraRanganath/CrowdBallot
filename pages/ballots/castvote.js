import React,{ Component } from 'react';
import { Table,Button } from 'semantic-ui-react';
import Ballot from '../../ethereum/ballot';
import CandidateRow from '../../components/candidateRow';
import Layout from '../../components/Layout';
import { Link } from '../../routes';

class CastVote extends Component {
    
    static async getInitialProps(props) {
        const { address } = props.query;
        const ballot = Ballot(address);
        const candidateCount = await ballot.methods.getCandidatesCount().call();
        const votersCount = await ballot.methods.votersCount().call();
        const candidates = await Promise.all(
            Array(parseInt(candidateCount)).fill().map((element,index) => {
                return ballot.methods.candidates(index).call()
            })
        );

        return {address, candidates, candidateCount, votersCount};
    }


    renderRows() {
        return this.props.candidates.map((candidate, index) => {
            return <CandidateRow 
                key={index}
                id={index}
                candidate={candidate}
                address={this.props.address}
            />
        }
        );
    }
    
    render() {
        
        return(
        <Layout>
        
        <h3>Please cast your Votes Below</h3>
        <Link route={`/ballots/${this.props.address}`}>
            <Button primary>Back</Button>
        </Link>
        <Table  selectable size='large'>
            <Table.Header>
            <Table.Row>
                <Table.HeaderCell width={2}>ID</Table.HeaderCell>
                <Table.HeaderCell width={3}>Name</Table.HeaderCell>
                <Table.HeaderCell width={3}>Party</Table.HeaderCell>
                <Table.HeaderCell width={2}>Age</Table.HeaderCell>
                <Table.HeaderCell width={2}>Cast Vote</Table.HeaderCell>
            </Table.Row>
            </Table.Header>

            <Table.Body>
                {this.renderRows()}
            </Table.Body>
        </Table>
        
        </Layout>
        );
    }
}

export default CastVote;