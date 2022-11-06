import React from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import {Button, Container, Grid, Header, Icon} from 'semantic-ui-react';
import {useNavigate} from "react-router-dom";
import {Parallax} from 'react-parallax';
import bgImage from '../images/bg.jpg';


export default function IntroPage() {
    const navigate = useNavigate();
    return <div>
        <Parallax
            blur={0}
            bgImage={bgImage}
            bgImageAlt="Background"
            strength={200}
        >
            <Container text style={{color: '#fffffff'}}>
                <div key='spacer1' style={{height: 100}}/>
                <Header as='h1' inverted className='white'>Votosphere</Header>
                <p className='inverted'>
                    A simple poll creator.
                </p>
                <Button primary onClick={() => navigate('/createPoll')}>Create a Poll </Button>
                <div key='spacer2' style={{height: 100}}/>
            </Container>
        </Parallax>
        <div style={{height: 40}}/>
        <Container text>
            <Grid padded>
                <Grid.Row columns={3}>
                    <Grid.Column>
                        <Header as='h2' icon>
                            <Icon name='users'/>
                            Open Source
                            <Header.Subheader>Want to learn more? You can view all of the source code on
                                GitHub.</Header.Subheader>
                        </Header>
                    </Grid.Column>
                    <Grid.Column>
                        <Header as='h2' icon>
                            <Icon name='tv'/>
                            Simple
                            <Header.Subheader>Created with ease of use in mind, you can make new polls in a matter
                                of
                                seconds.</Header.Subheader>
                        </Header>
                    </Grid.Column>
                    <Grid.Column>
                        <Header as='h2' icon>
                            <Icon name='check'/>
                            Refreshing
                            <Header.Subheader>A UI that gets out of your way while still looking like it's from this
                                decade.</Header.Subheader>
                        </Header>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    </div>;
}
