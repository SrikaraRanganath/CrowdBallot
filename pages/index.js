import React, { Component } from 'react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';
import { Card, Button } from 'semantic-ui-react';


class ballotIndex extends Component {
    static async getInitialProps() {
        const ballots = await factory.methods.getDeployedBallots().call();

        return { ballots };
    }


        renderBallots = () => {
            const items = this.props.ballots.map(address => {
                return{
                    header: address,
                    description: (
                        <Link route={`/ballots/${address}`}>
                        <a>View Ballot</a>
                        </Link>
                    ),
                    fluid: true,
                    color: 'teal'
                };
            });
        
            return <Card.Group items={items} />
        }

        render() {
            return(
                <Layout>
                    <div>
                    <h3>
                        Open Elections!
                    </h3>
                    <Link route="/ballots/new">
                        <a>
                            <Button floated="right" content="Create Ballot" icon="add" primary />
                        </a>
                    </Link>

                    {this.renderBallots()}
                    </div>
                </Layout>
            );
        }
}


export default ballotIndex;