import React, {Component} from "react";
import {Button, Checkbox, Container, Form, Grid, Header, Input, Popup, Segment, TextArea} from "semantic-ui-react";
import './App.css';
import {uploadJson} from '../api';
import 'semantic-ui-css/semantic.min.css';
import {Route} from "react-router-dom";


export default class CreatePollPage extends Component {
    state = {
        title: '',
        description: '',
        numFields: 1,
        fieldNames: [],
        agreed: false,
        submitting: false,
        pollUrl: '',
        loading: false,
        shuffle: false
    };

    render() {
        return (
            <Container>
                <div style={{height: 40}}/>
                <Header>Create Poll</Header>
                <Grid centered>
                    <Grid.Row>
                        <Grid.Column computer={6} tablet={12} mobile={16}>
                            <Segment fluid raised style={{padding: 20}}>
                                <Form>
                                    <Form.Field control={Input} onChange={e => this.setState({title: e.target.value})}
                                                label='Title' placeholder='Title...'/>
                                    <Form.Field control={TextArea}
                                                onChange={e => this.setState({description: e.target.value})}
                                                label='Description' placeholder='Description...'/>
                                    <Form.Group inline>
                                        <label>Poll Options</label>
                                    </Form.Group>
                                    <Form.Group inline>
                                        <Checkbox label='Shuffle'
                                                  onChange={(event, data) => {
                                                      this.setState({shuffle: data.checked})
                                                  }}
                                        />
                                    </Form.Group>
                                    {
                                        this.state.fieldNames.concat(['']).map((name, i) => (
                                            <Form.Field key={i} control={Input} label={'Option ' + (i + 1)}
                                                        value={name}
                                                        placeholder='New poll option...'
                                                        onChange={(event) => {
                                                            const text = event.target.value;

                                                            this.setState(state => {
                                                                if (text.length > 0) {
                                                                    state.fieldNames[i] = text;
                                                                } else {
                                                                    state.fieldNames.splice(i);
                                                                }
                                                                return state;
                                                            })
                                                        }}/>
                                        ))
                                    }

                                    <Form.Field>
                                        <Popup trigger={
                                            <Checkbox label='I agree to the Terms and Conditions'
                                                      onChange={(event, data) => {
                                                          this.setState({agreed: data.checked})
                                                      }}
                                            />}
                                               content='You agree to use this service in a way that breaks no laws and is not evil.'/>
                                    </Form.Field>
                                    <Route render={({history}) => (
                                        <Form.Field>
                                            <Button onClick={() => {
                                                this.setState({loading: true});
                                                const fields = this.state.fieldNames;
                                                const initialCounts = Object.assign({}, ...fields.map(k => ({[k]: 0})));
                                                uploadJson({
                                                    counts: initialCounts,
                                                    numResponses: 0
                                                }).then(countsId => uploadJson({
                                                    title: this.state.title,
                                                    description: this.state.description,
                                                    fields: this.state.fieldNames,
                                                    counts: countsId,
                                                    shuffle: this.state.shuffle
                                                })).then(id => {
                                                    history.push("/poll?id=" + id);
                                                });
                                            }} disabled={!this.state.agreed || this.state.loading || (
                                                !this.state.title.length > 0 || !this.state.fieldNames.length > 0
                                            )}>
                                                Create
                                            </Button>
                                        </Form.Field>
                                    )}/>
                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }
}
