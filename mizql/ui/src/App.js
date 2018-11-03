import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import Home from './components/Home';

const App = () => (
  <BrowserRouter>
    <div>
      <Route exact path='/' component={Home}/>
      <Route path='/login' component={Login}/>
    </div>
  </BrowserRouter>
);

const Login = () => (
  <div>
    <h2>Login</h2>
    <p>Not Implemented</p>
  </div>
);

export default App;
