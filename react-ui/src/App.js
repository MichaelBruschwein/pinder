import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from './Login/Login.js'
import Register from './Register/Register.js'
import Finder from './Finder/Finder.js'
import Navbar from './Navbar/Navbar.js';
import Matches from './Matches/Matches.js';
import Profile from './Profile/Profile.js';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { } from '@material-ui/core/colors'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: 'ff1a8c',
      main: '#009688',
      dark: '339ba5',
      contrastText: '#000',
    },
    secondary: {
      light: '#005b64',
      main: '#ff3385',
      dark: '#ff9d00',
      contrastText: '#000',
    },
    button: {
      backgroundColor: 'orange',
      textColor: 'gray',
      height: 50,
      width: 100,
      borderRadius: 35,
      opacity: 50
    },
  },
});

class App extends Component {
  constructor() {
    super()
    this.token = localStorage.getItem('pinder_token')
    if (this.token !== null) {
      this.state = {
        userLoggedIn: true
      }
    } else {
      this.state = {
        userLoggedIn: false
      }
    }
    this.logout = this.logout.bind(this)
    this.login = this.login.bind(this)
  }

  logout() {
    this.setState({
      userLoggedIn: false
    })
    localStorage.removeItem('pinder_token')
  }
  login() {
    this.setState({
      userLoggedIn: true
    })
  }

  render() {
    return (
      <Router>
        <div className="App">
          <MuiThemeProvider theme={theme}>
            <Navbar userLoggedIn={this.state.userLoggedIn} logout={this.logout} />
            {/* use profile to manage login */}
            <Route exact path="/" component={Profile} />
            <Route path="/login" render={props => <Login {...props} login={this.login} />} />
            <Route path="/register" component={Register} />
            <Route path="/finder" component={Finder} />
            <Route path="/profile" render={props => <Profile {...props} logout={this.logout} />} />
            <Route path="/matches" component={Matches} />
          </MuiThemeProvider>
        </div>
      </Router>
    );
  }
}

export default App;
