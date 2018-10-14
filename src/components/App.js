import React, {Component} from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import Navbar from './Navbar';
import Footer from './Footer';
import {HashRouter, Route} from "react-router-dom";
import IntroPage from "./IntroPage";
import CreatePollPage from './CreatePollPage';
import PollPage from './PollPage';
import ViewPollPage from './ViewPollPage';


export default class App extends Component {
    render() {
        return (
            <HashRouter>
                <div className="App Site">
                    <div className="Site-content">
                        <div className="App-header">
                            <Navbar key='navbar'/>
                        </div>
                        <div className="main">
                            <Route key={1} exact path="/" component={IntroPage}/>
                            <Route key={2} exact path="/createPoll" component={CreatePollPage}/>
                            <Route key={3} exact path="/poll" component={PollPage}/>
                            <Route key={4} exact path="/viewPoll" component={ViewPollPage}/>
                        </div>
                    </div>
                    <Footer key='footer'/>
                </div>
            </HashRouter>
        );
    }
}
