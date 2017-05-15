import React from 'react';
import Page from "./Page";

class Dashboard extends Page {
    constructor() {
        super("Dashboard", ...arguments);
    }

    render() {
        super.render(...arguments);
        return (
            <h1>Dashboard</h1>
        );
    }
}

export default Dashboard;
