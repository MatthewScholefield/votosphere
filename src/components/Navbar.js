import React from 'react';
import {Container, Image, Menu} from 'semantic-ui-react';
import {Link} from "react-router-dom";
import logo from '../images/logo.png';


export default function Navbar() {
    return <Menu stackable size='massive'>
        <Container>
            <Menu.Item href='#'>
                <Image src={logo} style={{height: 30}}/>
            </Menu.Item>
            <Menu.Item href='#'>
                Votosphere
            </Menu.Item>

            <Menu.Menu position='right'>
                {[
                    {name: '+', key: '/createPoll'},
                    {name: 'View', key: 'viewPoll'}
                ].map(({name, key}) => (
                    <Link key={key} to={key}>
                        <Menu.Item
                            active={false}
                            name={key}
                            content={name}
                        />
                    </Link>
                ))}
            </Menu.Menu>
        </Container>
    </Menu>;
}
