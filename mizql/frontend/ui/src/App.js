import React from 'react';
import './App.css';
import {BrowserRouter, Route} from 'react-router-dom';

const App = () => (
  <BrowserRouter>
    <div>
      <Route exact path='/' component={Home}/>
      <Route path='/login' component={Login}/>
    </div>
  </BrowserRouter>
);

const Home = () => (
  <div>
    <h2>Home</h2>
    <p>Not Implemented</p>
  </div>
);

const Login = () => (
  <div>
    <h2>Login</h2>
    <p>Not Implemented</p>
  </div>
);

export default App;
