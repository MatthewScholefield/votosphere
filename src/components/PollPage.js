import React, {Component} from "react";
import queryString from "query-string";
import './App.css';
import {getJson, updateJson} from '../api';
import 'semantic-ui-css/semantic.min.css';
import {Button, Container, Form, Grid, Header, Radio, Segment} from 'semantic-ui-react';
import {Route} from "react-router-dom";
import ReactMarkdown from 'react-markdown'


export default class PollPage extends Component {

    state = {
        title: "",
        description: "",
        fields: [],
        choices: {},
        counts: "",
        id: ""
    };
    handleRadioUpdate = (value, field, amount) => {
        if (value !== undefined) {
            this.setState(({choices}) => {
                choices[field] = amount;
                return {choices: choices};
            })
        }
    };

    componentWillMount() {
        const id = queryString.parse(this.props.location.search).id;
        if (id !== undefined) {
            getJson(id).then(json => this.setState({
                title: json.title,
                description: json.description,
                fields: json.fields,
                counts: json.counts,
                id: id
            }));
        }
    }

    render() {
        return (
            <Container>
                <div style={{height: 40}}/>
                <Header>{this.state.title || "Respond to Poll"}</Header>
                <div style={{listStylePosition: 'inside'}}>
                    <ReactMarkdown source={this.state.description || "Respond to a Poll from a link"}/>
                </div>
                <div style={{height: 20}}/>
                <Grid centered>
                    <Grid.Row>
                        <Grid.Column computer={6} tablet={12} mobile={16}>

                            <Segment fluid raised style={{padding: 20}}>
                                <Form>
                                    {
                                        this.state.fields.map(field => (
                                            <Form.Group inline key={field}>
                                                <label>{field}</label>
                                                {
                                                    [...Array(3).keys()].map(amount => (
                                                        <Form.Field
                                                            key={amount}
                                                            control={Radio}
                                                            label={amount}
                                                            value={amount}
                                                            name={field}
                                                            onChange={(e, {value}) => this.handleRadioUpdate(value, field, amount)}
                                                            checked={this.state.choices[field] === amount}
                                                        />
                                                    ))
                                                }
                                            </Form.Group>
                                        ))
                                    }
                                    <Route render={({history}) => (
                                        <Form.Field control={Button}
                                                    onClick={() => {
                                                        const choices = this.state.choices;
                                                        getJson(this.state.counts).then(
                                                            data => updateJson(this.state.counts, {
                                                                counts: Object.assign({}, ...Object.keys(choices).map(k => ({[k]: data.counts[k] + choices[k]}))),
                                                                numResponses: data.numResponses + 1
                                                            })
                                                        ).then(r => {
                                                            history.push("/viewPoll?id=" + this.state.id);
                                                        });
                                                    }}
                                                    disabled={Object.keys(this.state.choices).length !== this.state.fields.length}
                                        >
                                            Continue
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
