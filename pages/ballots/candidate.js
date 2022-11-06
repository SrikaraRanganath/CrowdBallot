import React,{ Component } from 'react';
import Layout from '../../components/Layout';
import CandidateForm from '../../components/candidateForm';

class CandidateRegister extends Component {
    
    static async getInitialProps(props) {
        return { address: props.query.address };
    }
    
    render() {
        return(
            <Layout>
            <CandidateForm  address={this.props.address} />
            </Layout>
        );
    }
}
    

export default CandidateRegister;