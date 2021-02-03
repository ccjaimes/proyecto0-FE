import React, { Component } from 'react';
import Ingreso from './Ingreso';
import Eventos from './eventos';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" exact>
                        <Ingreso/>
                    </Route>
                    <Route path="/eventos">
                        <Eventos/>
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default App;