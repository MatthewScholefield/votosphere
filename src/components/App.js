import React from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import Navbar from './Navbar';
import Footer from './Footer';
import {HashRouter, Route, Routes} from "react-router-dom";
import IntroPage from "./IntroPage";
import CreatePollPage from './CreatePollPage';
import PollPage from './PollPage';
import ViewPollPage from './ViewPollPage';


export default function App() {
    return (
        <HashRouter>
            <div className="App Site">
                <div className="Site-content">
                    <div className="App-header">
                        <Navbar key='navbar'/>
                    </div>
                    <div className="main">
                        <Routes>
                            <Route key={1} exact path="/" element={<IntroPage/>}/>
                            <Route key={2} exact path="/createPoll" element={<CreatePollPage/>}/>
                            <Route key={3} exact path="/poll" element={<PollPage/>}/>
                            <Route key={4} exact path="/viewPoll" element={<ViewPollPage/>}/>
                        </Routes>
                    </div>
                </div>
                <Footer key='footer'/>
            </div>
        </HashRouter>
    );
}
