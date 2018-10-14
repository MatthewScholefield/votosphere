import React, {Component} from "react";
import queryString from "query-string";
import './App.css';
import {getJson} from '../api';
import 'semantic-ui-css/semantic.min.css';
import {Button, Container, Grid, Header, Icon, Input, Progress, Segment} from 'semantic-ui-react';
import {Route} from "react-router-dom";
import ReactMarkdown from 'react-markdown';


export default class ViewPollPage extends Component {
    state = {
        title: "",
        description: "",
        fields: [],
        countsData: {counts: {}},
        id: "",
        badId: false,
        loading: true,
        idText: ""
    };

    updateData = id => {
        id = id || "";
        this.setState({loading: true, id: id, badId: false});

        if (id.length === 0) {
            this.setState({loading: false});
            return;
        }

        getJson(id).then(json => {
            if (json.fields === undefined || json.counts === undefined) {
                this.setState({badId: true, id: ""});
            }
            this.setState({
                title: json.title,
                description: json.description,
                fields: json.fields,
            });
            return getJson(json.counts);
        }).then(data => {
            this.setState({countsData: data, loading: false})
        }).catch(e => {
            this.setState({badId: true, loading: false, id: ""})
        });
    };
    renderPollView = () => {
        const urlId = queryString.parse(this.props.location.search).id;
        if (urlId !== this.state.id) {
            this.updateData(urlId);
        }
        const counts = this.state.countsData.counts || {};
        const maxCount = Object.keys(counts).length === 0 ? 1 : Math.max(...Object.values(counts));
        const colors = [
            'orange', 'yellow', 'olive', 'teal', 'blue',
            'violet', 'purple', 'pink', 'brown', 'grey', 'black'
        ];  // 'red', 'green' Too misleading
        if (this.state.fields === undefined) {
            return [];
        }
        return [
            this.state.fields.map((field, i) => {
                return <Progress progress='value' key={field}
                                 value={counts[field] || 0} total={maxCount}
                                 color={colors[i % colors.length]}>{field}</Progress>
            }),
            <Button onClick={() => this.updateData(this.state.id)} icon labelPosition='right'
                    disabled={this.state.loading}>
                Refresh
                <Icon name='refresh'/>
            </Button>
        ];
    };
    renderAskIdView = () => {
        return <div>
            <p>Enter poll id:</p>
            <Input fluid error={this.state.badId} type='text' value={this.state.idText} action
                   placeholder='ie. pc9z1...' onChange={e => this.setState({idText: e.target.value})}>
                <input/><Route render={({history}) => <Button onClick={() => {
                history.push("/viewPoll?id=" + this.state.idText);
                this.updateData(this.state.idText);
            }}>Submit</Button>}/>
            </Input>
        </div>;
    };

    componentWillMount() {
        this.updateData(queryString.parse(this.props.location.search).id);
    }

    render() {
        return (
            <Container>
                <div style={{height: 40}}/>
                <Header>{this.state.title || "View Poll"}</Header>
                <div style={{listStylePosition: 'inside'}}>
                    <ReactMarkdown source={this.state.description || "View stats on an existing poll"}/>
                </div>
                <div style={{height: 20}}/>
                <Grid centered>
                    <Grid.Row>
                        <Grid.Column computer={6} tablet={12} mobile={16}>
                            <Segment raised style={{padding: 20}}>
                                {this.state.id ? this.renderPollView() : this.renderAskIdView()}
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }
}