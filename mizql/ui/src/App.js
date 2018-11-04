import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import {MuiThemeProvider} from '@material-ui/core/styles';
import {theme} from './contains/theme';
import {Store} from './store';

const App = () => (
  <BrowserRouter>
    <Store.Provider>
      <MuiThemeProvider theme={theme}>
        <Route exact path='/' component={Home}/>
        <Route path='/login' component={Login}/>
      </MuiThemeProvider>
    </Store.Provider>
  </BrowserRouter>
);

export default App;
