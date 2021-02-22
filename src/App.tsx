import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';

import './App.global.css';
import SideBar from './components/SideBar';
import Dataset from './components/Dataset';

const Home = () => {
    return (
        <div>
            <Grid container>
                <Grid item xs={4}>
                    <SideBar />
                </Grid>
                <Grid item xs={8}>
                    <Dataset />
                </Grid>
            </Grid>
        </div>
    );
};

export default function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" component={Home} />
            </Switch>
        </Router>
    );
}
