import React, {Component} from "react";
import queryString from "query-string";
import './App.css';
import {getJson, updateJson} from '../api';
import 'semantic-ui-css/semantic.min.css';
import {Button, Container, Form, Grid, Header, Radio, Segment} from 'semantic-ui-react';
import {Route} from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import Cookies from "universal-cookie";
import {shuffle} from "../utils";
import {Slider} from 'react-semantic-ui-range'


class InputMeter extends Component {
    render() {
        return <Slider color="red" inverted={false}
                       settings={{
                           start: 0.5,
                           min: 0,
                           max: 1,
                           step: 0.01,
                           onChange: (value) => {
                               this.props.onChange(value)
                           }
                       }} style={{marginBottom: 14}}/>;
    }
}


export default class PollPage extends Component {
    state = {
        title: "",
        description: "",
        extraDescriptions: {},
        fields: [],
        choices: {},
        counts: "",
        id: "",
        answeredIds: []
    };

    constructor(props) {
        super(props);
        this.cookies = new Cookies();
    }

    handleRadioUpdate = (field, amount) => {
        this.setState(({choices}) => {
            choices[field] = amount;
            return {choices: choices};
        })
    };

    submitForm = (history) => {
        const choices = this.state.choices;
        getJson(this.state.counts).then(
            data => {
                const newData = {
                    counts: Object.assign({}, ...Object.keys(choices).map(k => ({[k]: data.counts[k] + choices[k]}))),
                    numResponses: data.numResponses + 1
                };
                if (newData.counts !== undefined && newData.counts.length > 0) {
                    updateJson(this.state.counts, newData);
                }
            }
        ).then(r => {
            const answeredIds = this.state.answeredIds;
            answeredIds.push(this.state.id);
            this.cookies.set('answeredIds', answeredIds.join(':'), {expires: new Date(2145916800000)})
            history.push("/viewPoll?id=" + this.state.id);
        });
    };

    componentWillMount() {
        this.setState({answeredIds: (this.cookies.get('answeredIds') || '').split(':')});
        const id = queryString.parse(this.props.location.search).id;
        if (id !== undefined) {
            getJson(id).then(json => {
                if (json.shuffle) {
                    shuffle(json.fields);
                }
                this.setState({
                    title: json.title,
                    description: json.description,
                    extraDescriptions: json.extraDescriptions,
                    fields: json.fields,
                    counts: json.counts,
                    id: id
                });
            });
        }
    }

    renderField = field => {
        const selector = <InputMeter amount={this.state.choices[field] || 0.5}
                                     onChange={val => this.handleRadioUpdate(field, val)}/>;
        const desc = this.state.extraDescriptions[field];
        if (desc) {
            return [
                <Form.Field><label style={{fontSize: '1.2rem'}}>{field}</label></Form.Field>,
                <p><ReactMarkdown source={desc}/></p>,
                selector
            ];
        } else {
            return [<Form.Group inline key={field}>
                <label>{field + ':'}</label>
            </Form.Group>, selector]
        }
    };

    render() {
        if (this.state.id && this.state.answeredIds.includes(this.state.id)) {
            return <Route render={({history}) => {
                history.push("/viewPoll?id=" + this.state.id);
                return <div/>;
            }}/>
        }
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
                                            this.renderField(field)
                                        ))
                                    }
                                    <Route render={({history}) => (
                                        <Form.Field control={Button}
                                                    onClick={() => this.submitForm(history)}
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
