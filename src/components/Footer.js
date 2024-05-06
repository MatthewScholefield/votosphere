import React from 'react';
import { Container, Grid, Header, Icon, Menu, Popup } from 'semantic-ui-react';


function Social({ name, href }) {
    const fake = href === "#";
    const icon = <Icon name={name} size='huge' style={{ color: '#777777' }} />;
    const inner = fake ? icon : <a href={href} target='_blank' rel='noopener noreferrer'>{icon}</a>;
    return fake ? (
        <Popup trigger={inner} content={"We don't actually have a page on " + name + " yet."} />
    ) : inner;
}

export default function Footer() {
    return <>
        <div style={{ height: 40 }} />
        <Menu attached='bottom' style={{ backgroundColor: '#F5F5F5' }}>
            <Container style={{ alignContent: 'center', textAlign: 'center' }}>
                <Grid centered stackable style={{ padding: 40 }}>
                    <Grid.Column mobile={16} tablet={4} computer={4}>
                        <Header>
                            About Us
                        </Header>
                        <p>
                            We are a platform for creating quick, simple polls. You can find more info about the
                            project on GitHub.
                        </p>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={4} computer={4}>
                        <Header>
                            Social
                        </Header>
                        <Social name='twitter' href="#" />
                        <Social name='facebook' href="#" />
                        <Social name='github' href='https://github.com/matthewscholefield/Votosphere' />
                        <Social name='youtube' href='#' />
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={4} computer={4}>
                        <Header>
                            More Info
                        </Header>
                        <p>Votosphere is a simple platform to create polls. The description is rendered as
                            markdown.</p>
                        <p>© 2024 Matthew Scholefield</p>
                    </Grid.Column>
                </Grid>
            </Container>
        </Menu>
    </>;
}
