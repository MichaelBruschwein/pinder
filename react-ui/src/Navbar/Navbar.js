import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
//import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
import "./Navbar.css"
import '../App.css';
import './pawprint.css'

const styles = {
  button:{
    backgroundColor: 'orange',
    textColor: 'gray'
  },
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  palette: {
    type: 'dark',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};


class Navbar extends React.Component {
  render() {
    if (!this.props.userLoggedIn) { // User isn't logged in
      return (
        <div className={this.props.classes.root}>
          <AppBar position="static">
            <Toolbar>
              <Link to="/">
                <Button variant="contained" color="secondary"><span className="paw">Pinder</span></Button></Link>
              {/* <Typography variant="h6" color="inherit" className={this.props.classes.grow}>
              </Typography> */}
              <Link to="/register"><Button className={this.props.classes.button} color="inherit" >Register</Button></Link>
              <Link to="/login" ><Button className = {this.props.classes.button} color="inherit">Login</Button></Link>
            </Toolbar>
          </AppBar>
        </div>
      )
    } else { //User is logged in
      return (
        <div className={this.props.classes.root}>
          <AppBar className="appbar" position="static">
            <Toolbar>
              <Link to="/">
              {/* Inheriting Secondary color for the button from the theme in App.JS */}
              <Button variant="contained" color="secondary"><span className="paw">Pinder</span></Button></Link>
              <Link to="/finder"><Button size = "large" className="navbarButton" color="inherit">Finder</Button></Link>
              <Link to="/matches"><Button className="navbarButton" color="inherit">Matches</Button></Link>
              <Link to="/profile"><Button className="navbarButton" color="inherit">Profile</Button></Link>
              <Link to="/login" ><Button className="navbarButton" onClick={this.props.logout} color="inherit">Logout</Button></Link>
            </Toolbar>
          </AppBar>
        </div>
      )
    }
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navbar);
