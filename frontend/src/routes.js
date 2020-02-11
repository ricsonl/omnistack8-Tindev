import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';


function Routes(){
    return(
        <BrowserRouter>
            <Route exact path="/" component={Login}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/home/:id" component={Home}/>
        </BrowserRouter>
    );
}

export default Routes;