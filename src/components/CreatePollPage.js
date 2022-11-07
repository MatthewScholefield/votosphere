import React, {useState} from "react";
import {
    Button,
    Checkbox,
    Container,
    Form,
    Grid,
    Header,
    Input,
    Popup,
    Segment,
    TextArea,
} from "semantic-ui-react";
import './App.css';
import {uploadJson} from '../api';
import 'semantic-ui-css/semantic.min.css';
import {useNavigate} from "react-router-dom";


export default function CreatePollPage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fieldNames, setFieldNames] = useState([]);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [isExtraDescOpen, setIsExtraDescOpen] = useState({});
    const [extraDesc, setExtraDesc] = useState({});
    return (
        <Container>
            <div style={{height: 40}}/>
            <Header>Create Poll</Header>
            <Grid centered>
                <Grid.Row>
                    <Grid.Column computer={6} tablet={12} mobile={16}>
                        <Segment raised style={{padding: 20}}>
                            <Form>
                                <Form.Field control={Input} value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            label='Title' placeholder='Title...'/>
                                <Form.Field control={TextArea} value={description}
                                            onChange={e => setDescription(e.target.value)}
                                            label='Description' placeholder='Description...'/>
                                <Form.Group inline>
                                    <label>Poll Options</label>
                                </Form.Group>
                                <Form.Group inline>
                                    <Checkbox label='Shuffle'
                                                onChange={(event, data) => setShuffle(data.checked)}
                                    />
                                </Form.Group>
                                {
                                    fieldNames.concat(['']).map((name, i) => (
                                        <Form.Field key={i}>
                                            <label>{'Option ' + (i + 1)}</label>
                                            <Form.Field>
                                                <Input
                                                value={name}
                                                label={<Button
                                                    icon='ellipsis horizontal'
                                                    onClick={() => {
                                                        setIsExtraDescOpen({...isExtraDescOpen, [i]: !isExtraDescOpen[i] || !!extraDesc[i]});
                                                    }}/>}
                                                labelPosition='right'
                                                placeholder='New poll option...'
                                                onChange={(event) => {
                                                    const text = event.target.value;
                                                    const fieldNamesNew = [...fieldNames];
                                                    if (text.length > 0) {
                                                        fieldNamesNew[i] = text;
                                                    } else {
                                                        fieldNamesNew.splice(i);
                                                    }
                                                    setFieldNames(fieldNamesNew)
                                                }}/>
                                            </Form.Field>
                                            <Form.Field key={2*i}>

                                            {
                                                !isExtraDescOpen[i] ? <div/> : <Form.Field control={TextArea}
                                                            onChange={e => setExtraDesc({...extraDesc, [i]: e.target.value})}
                                                            placeholder='Option Description...' value={extraDesc[i]}/>
                                            }
                                            </Form.Field>

                                        </Form.Field>
                                    ))
                                }

                                <Form.Field>
                                    <Popup trigger={
                                        <Checkbox label='I agree to the Terms and Conditions'
                                                    onChange={(_, data) => setAgreed(data.checked)}
                                        />}
                                            content='You agree to use this service in a way that breaks no laws and is not evil.'/>
                                </Form.Field>
                                <Form.Field>
                                    <Button onClick={() => {
                                        setLoading(true);
                                        const initialCounts = Object.assign({}, ...fieldNames.map(k => ({[k]: 0})));
                                        const extraDescriptions = {};
                                        const descs = Object.values(extraDesc);
                                        const indices = Object.keys(extraDesc);
                                        for (let i = 0; i < descs.length; ++i) {
                                            extraDescriptions[fieldNames[indices[i]]] = descs[i];
                                        }
                                        uploadJson({
                                            counts: initialCounts,
                                            numResponses: 0
                                        }).then(countsId => uploadJson({
                                            title,
                                            description,
                                            extraDescriptions,
                                            fields: fieldNames,
                                            counts: countsId,
                                            shuffle
                                        })).then(id => {
                                            navigate("/poll?id=" + id);
                                        });
                                    }} disabled={!agreed || loading || title.length <= 0 || fieldNames.length <= 0} loading={loading}>
                                        Create
                                    </Button>
                                </Form.Field>
                            </Form>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
}
