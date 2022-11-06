import React,{ Component } from 'react';
import { Menu, Segment,Icon } from 'semantic-ui-react';
import { Link } from '../routes';

class Header extends Component {
    state = { activeItem: 'Ballots' }; 
    
    handleItemClick = (e ,{ name }) => this.setState({ activeItem: name })
    
    render() {
        const { activeItem } = this.state;
        return (     
        <Segment inverted style={{marginTop: '16px'}}>  
            <Menu inverted secondary>
            <Link route="/">
                <a className='item'>
                    CrowdBallot
                    <Icon disabled name='btc' size='big' />
                </a>
            </Link>

            <Menu.Menu position="right">
                <Link route="/">
                    <a className='item'> Ballots </a>
                </Link>

                <Link route="/ballots/new">
                    <a className='item'><Icon name='plus circle' size='large' /></a>
                </Link>
            </Menu.Menu>
            </Menu>
        </Segment>
);
    }

}

export default Header;