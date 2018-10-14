import React, {Component} from 'react';
import {Container, Image, Menu} from 'semantic-ui-react';
import {Route} from "react-router-dom";


export default class Navbar extends Component {
    render() {
        return <Menu stackable size='massive'>
            <Container>
                <Menu.Item href='#'>
                    <Image src='images/logo.png' style={{height: 30}}/>
                </Menu.Item>
                <Menu.Item href='#'>
                    Votosphere
                </Menu.Item>

                <Menu.Menu position='right'>
                    {[
                        {name: '+', key: '/createPoll'},
                        {name: 'View', key: 'viewPoll'}
                    ].map(({name, key}) => (
                        <Route key={key} render={({history}) => (
                            <Menu.Item
                                onClick={(e, {name}) => {
                                    history.push(key);
                                    this.setState({activeItem: name});
                                }}
                                active={false}
                                name={key}
                                content={name}
                            />
                        )}/>
                    ))}
                </Menu.Menu>
            </Container>
        </Menu>
            ;
    }
}
