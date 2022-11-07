import React, {useEffect, useState} from "react";
import queryString from "query-string";
import './App.css';
import {getJson} from '../api';
import 'semantic-ui-css/semantic.min.css';
import {Button, Container, Grid, Header, Icon, Input, Progress, Segment} from 'semantic-ui-react';
import {useLocation, useNavigate} from "react-router-dom";
import ReactMarkdown from 'react-markdown';



function AskIdView({badId, submitId}) {
    const [idText, setIdText] = useState("");
    const navigate = useNavigate();

    return <div>
        <p>Enter poll id:</p>
        <Input fluid error={badId} type='text' value={idText} action
                placeholder='ie. pc9z1...' onChange={e => setIdText(e.target.value)}>
            <input/>
            <Button onClick={() => {
                navigate("/viewPoll?id=" + idText);
                submitId(idText);
            }}>Submit</Button>
        </Input>
    </div>;
}

export default function ViewPollPage() {
    const location = useLocation();
    const [countsData, setCountsData] = useState({counts: {}});
    const [id, setId] = useState(queryString.parse(location.search).id || "");
    const [updatedAt, setUpdatedAt] = useState(new Date().getTime());
    const [badId, setBadId] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pollInfo, setPollInfo] = useState({});

    useEffect(() => {
        setLoading(true);
        setBadId(false);

        if (id.length === 0) {
            setLoading(false);
            return;
        }

        getJson(id).then(json => {
            if (json.fields === undefined || json.counts === undefined) {
                setId("");
                setBadId(true);
            }
            setPollInfo({
                title: json.title,
                description: json.description,
                fields: json.fields,
            });
            return getJson(json.counts);
        }).then(data => {
            setCountsData(data);
            setLoading(false);
        }).catch(e => {
            setBadId(true);
            setLoading(false);
            setId("");
        });
    }, [id, updatedAt])

    const counts = countsData.counts || {};
    const maxCount = Object.keys(counts).length === 0 ? 1 : Math.max(...Object.values(counts));
    const colors = [
        'orange', 'yellow', 'olive', 'teal', 'blue',
        'violet', 'purple', 'pink', 'brown', 'grey', 'black'
    ];  // 'red', 'green' Too misleading

    const pollView = <>
        {(pollInfo.fields ?? []).map((field, i) => {
            return <Progress progress='value' key={field}
                            value={counts[field] || 0} total={maxCount}
                            color={colors[i % colors.length]}>{field}{pollInfo.extraDescriptions[field] ?
                                <><br/><ReactMarkdown>{pollInfo.extraDescriptions[field]}</ReactMarkdown></> : <></>
                            }</Progress>
        })}
        <Button onClick={() => setUpdatedAt(new Date().getTime())} icon labelPosition='right'
                disabled={loading}>
            Refresh
            <Icon name='refresh'/>
        </Button>
    </>;

    return (
        <Container>
            <div style={{height: 40}}/>
            <Header>{pollInfo.title || "View Poll"}</Header>
            <div style={{listStylePosition: 'inside'}}>
                <ReactMarkdown>{pollInfo.description || "View stats on an existing poll"}</ReactMarkdown>
            </div>
            <div style={{height: 20}}/>
            <Grid centered>
                <Grid.Row>
                    <Grid.Column computer={6} tablet={12} mobile={16}>
                        <Segment raised style={{padding: 20}}>
                            {id ? pollView : <AskIdView badId={badId} submitId={setId}/>}
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <br/>
            {countsData.numResponses !== undefined ?
                <div style={{color: '#999'}}>{`${countsData.numResponses}`} response{countsData.numResponses === 1 ? "" : "s"}</div> :
                <></>
            }
        </Container>
    );
}
