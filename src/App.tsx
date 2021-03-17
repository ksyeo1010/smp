/* eslint-disable react/display-name */
import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';

import SettingsIcon from '@material-ui/icons/Settings';
import SearchIcon from '@material-ui/icons/Search';
import DescriptionIcon from '@material-ui/icons/Description';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

import './App.global.css';
import SideBar, { RouteType, useStyles } from './components/SideBar';
import Search from './components/Search';
import Datasets from './components/Datasets';
import DataPage from './components/DataPage';

const mainRoutes: RouteType[] = [
    {
        path: '/search',
        text: 'Search',
        exact: true,
        icon: <SearchIcon />,
        component: Search,
    },
    {
        path: '/datasets',
        text: 'Datasets',
        exact: true,
        icon: <DescriptionIcon />,
        component: Datasets,
    },
    {
        path: '/predictions',
        text: 'Predictions',
        exact: true,
        icon: <TrendingUpIcon />,
        component: () => <div>Predictions</div>,
    },
];

const sideRoutes: RouteType[] = [
    {
        path: '/settings',
        text: 'Settings',
        exact: true,
        icon: <SettingsIcon />,
        component: () => <div>Settings</div>,
    },
];

const unrenderedRoutes: RouteType[] = [
    {
        path: '/datasets/:symbol',
        text: 'Symbol Viewer',
        exact: true,
        component: DataPage,
    },
];

export default function App() {
    const classes = useStyles();

    const routes = [...mainRoutes, ...sideRoutes];

    return (
        <Router>
            <div className={classes.root}>
                <SideBar mainRoutes={mainRoutes} sideRoutes={sideRoutes} />
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Switch>
                        {routes.map((route) => (
                            <Route
                                key={route.text}
                                path={route.path}
                                exact={route.exact}
                                component={route.component}
                            />
                        ))}
                    </Switch>
                    <Switch>
                        {unrenderedRoutes.map((route) => (
                            <Route
                                key={route.text}
                                path={route.path}
                                exact={route.exact}
                                component={route.component}
                            />
                        ))}
                    </Switch>
                </main>
            </div>
            <Redirect to={routes[0].path} />
        </Router>
    );
}
