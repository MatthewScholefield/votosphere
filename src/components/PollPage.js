import React, {useCallback, useEffect, useState} from "react";
import queryString from "query-string";
import './App.css';
import {getJson, updateJson} from '../api';
import 'semantic-ui-css/semantic.min.css';
import {Button, Container, Form, Grid, Header, Popup, Segment} from 'semantic-ui-react';
import {useLocation, useNavigate, Link} from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import Cookies from "universal-cookie";
import {shuffle} from "../utils";
import {Slider} from 'react-semantic-ui-range'


function InputMeter({value, onChange}) {
    return <Slider
        color="red"
        inverted={false}
        value={value}
        settings={{
            start: 0.5,
            min: 0,
            max: 1,
            step: 0.01,
            onChange
        }}
        style={{marginBottom: 14}}
    />;
}


let cookies = new Cookies();

export default function PollPage() {
    const navigate = useNavigate();
    const [poll, setPoll] = useState({});
    const [id, setId] = useState("");
    const [choices, setChoices] = useState({});
    const [answeredIds, setAnsweredIds] = useState((cookies.get('answeredIds') || '').split(':'));
    const location = useLocation();

    useEffect(() => {
        const idFromUrl = queryString.parse(location.search).id;
        if (idFromUrl !== undefined) {
            getJson(idFromUrl).then(json => {
                if (json.shuffle) {
                    shuffle(json.fields);
                }
                setPoll({
                    title: json.title,
                    description: json.description,
                    extraDescriptions: json.extraDescriptions,
                    fields: json.fields,
                    counts: json.counts,
                });
                setId(idFromUrl);
            });
        }
    }, [location.search])

    const submitForm = useCallback(() => {
        getJson(poll.counts).then(
            data => {
                const newData = {
                    counts: Object.assign({}, ...Object.keys(choices).map(k => ({[k]: data.counts[k] + choices[k]}))),
                    numResponses: data.numResponses + 1
                };
                if (newData.counts !== undefined && Object.keys(newData.counts).length > 0) {
                    updateJson(poll.counts, newData);
                }
            }
        ).then(r => {
            const newAnsweredIds = [...answeredIds, id];
            setAnsweredIds(newAnsweredIds);
            cookies.set('answeredIds', newAnsweredIds.join(':'), {expires: new Date(2145916800000)})
            navigate("/viewPoll?id=" + id);
        });
    }, [answeredIds, id, poll.counts, choices, navigate]);
    if (id && answeredIds.includes(id)) {
        navigate("/viewPoll?id=" + id);
        return <div/>;
    }
    const canSubmit = Object.keys(choices).length === (poll.fields ?? []).length;
    return (
        <Container>
            <div style={{height: 40}}/>
            <Header>{poll.title || "Respond to Poll"}</Header>
            <div style={{listStylePosition: 'inside'}}>
                <ReactMarkdown>{poll.description || "Respond to a Poll from a link"}</ReactMarkdown>
            </div>
            <div style={{height: 20}}/>
            <Grid centered>
                <Grid.Row>
                    <Grid.Column computer={6} tablet={12} mobile={16}>
                        <Segment raised style={{padding: 20}}>
                            <Form>
                                {
                                    (poll.fields ?? []).map(field => {
                                        const selector = <InputMeter key={`select-${field}`} value={choices[field] ?? 0.5}
                                                                     onChange={val => setChoices({...choices, [field]: val})}/>;
                                        const desc = poll.extraDescriptions[field];
                                        if (desc) {
                                            return <div key={field}>
                                                <Form.Field key={`label-${field}`}><label style={{fontSize: '1.2rem'}}>{field}</label></Form.Field>
                                                <p key={`desc-${field}`}><ReactMarkdown>{desc}</ReactMarkdown></p>
                                                {selector}
                                            </div>;
                                        } else {
                                            return <div key={field}>
                                                <Form.Group key={`label-${field}`} inline>
                                                    <label>{field + ':'}</label>
                                                </Form.Group>
                                                {selector}
                                            </div>
                                        }
                                    })
                                }
                                <Popup trigger={
                                    <div style={{width: '100px'}}>
                                        <Form.Field key={`continue`} control={Button}
                                                    onClick={submitForm}
                                                    disabled={!canSubmit}
                                        >
                                            Continue
                                        </Form.Field>
                                    </div>
                                } content={`You have not scored the following options: ${(poll.fields || []).filter(x => !Object.hasOwn(choices, x)).join(", ")}`} disabled={canSubmit}/>
                            </Form>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Link to={`/viewPoll?id=${id}`}>
                        <Button>
                            View Results
                        </Button>
                    </Link>
                </Grid.Row>
            </Grid>
        </Container>
    );
}
