import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import axios from 'axios';
import PhotoUploader from '../PhotoUploader/PhotoUploader';
import { Redirect } from 'react-router-dom';
import '../App.css';

const styles = theme => ({
  container: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 700,
      marginLeft: 'auto',
      marginRight: 'auto',
    }
  },
  menu: {
    width: 200,
  },
});
const sex = [
  {
    value: 'Male',
    label: 'Male',
  },
  {
    value: 'Female',
    label: 'Female',
  }
];

class TextFields extends React.Component {
  constructor() {
    super()
    this.state = {
      registered: false,
      name: '',
      username: '',
      email: '',
      confirm_email: '',
      password: '',
      confirm_password: '',
      species: '',
      sex: '',
      city: '',
      state: '',
      age: '',
      bio: '',
      url: 'http://www.reptilegardens.com/assets/images/gallery/images/agama_copy.jpg'
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.checkForm = this.checkForm.bind(this)
    this.getUrl = this.getUrl.bind(this)
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
  checkForm() {
    axios.get('/').then((error) => { console.log(error) })
    let counter = 0;
    Object.values(this.state).forEach((v) => {
      if (v.length < 1) {
        counter++;
      }
    })
    if (counter >= 1) {
      console.log(counter)
      alert("please make sure all forms are filled out")
    } else if (counter === 0) {
      this.handleSubmit()
    }
    counter = 0;
  }

  handleSubmit() {
    if (this.state.email !== this.state.confirm_email) {
      alert("please make sure that your emails match")
    } else if (this.state.password !== this.state.confirm_password) {
      alert("please make sure that your passwords match")
    } else { 
      axios.post('/user', {
        name: this.state.name,
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        species: this.state.species,
        sex: this.state.sex,
        city: this.state.city,
        state: this.state.state,
        age: this.state.age,
        bio: this.state.bio,
        url: this.state.url
      }).then(() => {

      }).catch((error) => { console.log(error) })
    }
  }

  getUrl(url) {
    this.setState({
      url: url
    });
    console.log(this.state)
  }


  render() {
    const { classes } = this.props;
    if (this.state.registered === true) {
      return <Redirect to='/login' />
    } else {
      return (
        <div
          style={{
            paddingTop: '5%'
          }}
        >
          <form className={classes.container} noValidate autoComplete="off">
            <Card>
              <TextField
                required
                id="Name"
                label="Name (ex. John Doe)"
                value={this.state.name}
                onChange={this.handleChange('name')}
                margin="normal"
                fullWidth
              />
              <TextField
                id="Username"
                label="Username (ex. DogLover77)"
                value={this.state.username}
                onChange={this.handleChange('username')}
                margin="normal"
                fullWidth
                required
              />
              <TextField
                id="Email"
                label="Email (ex. John@gmail.com)"
                value={this.state.email}
                onChange={this.handleChange('email')}
                type="email"
                margin="normal"
                fullWidth
                required
              />
              <TextField
                id="Email-Confirmation"
                label="Confirm Email"
                value={this.state.confirm_email}
                onChange={this.handleChange('confirm_email')}
                type="email"
                margin="normal"
                fullWidth
                required
              />
              <TextField
                id="Password"
                label="Password"
                value={this.state.password}
                onChange={this.handleChange('password')}
                type="password"
                margin="normal"
                fullWidth
                required
              />
              <TextField
                id="Password-Confirmation"
                label="Confirm Password"
                value={this.state.confirm_password}
                onChange={this.handleChange('confirm_password')}
                type="password"
                margin="normal"
                fullWidth
                required
              />
              <TextField
                id="Species"
                label="Species (ex. Cat)"
                value={this.state.species}
                onChange={this.handleChange('species')}
                type="text"
                margin="normal"
                fullWidth
                required
              />
              <TextField
                id="Sex"
                select
                label="Sex"
                value={this.state.sex}
                onChange={this.handleChange('sex')}
                margin="normal"
                fullWidth
                required
              >
                {sex.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="City"
                label="City (ex. Bozeman)"
                value={this.state.city}
                onChange={this.handleChange('city')}
                margin="normal"
                fullWidth
                required
              />
              <TextField
                id="State"
                label="State (ex. MT)"
                value={this.state.state}
                onChange={this.handleChange('state')}
                margin="normal"
                fullWidth
                required
              />
              <TextField
                id="Age"
                label="Age of Pet"
                value={this.state.age}
                onChange={this.handleChange('age')}
                type="number"
                margin="normal"
                fullWidth
                required
              />
              <TextField
                id="Bio"
                label="Bio (Limit 500 Characters)"
                value={this.state.bio}
                onChange={this.handleChange('bio')}
                type="text"
                margin="normal"
                multiline
                required
                fullWidth
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={this.checkForm}
              >
                Submit
          </Button>
            </Card>
          </form>
          <img className="profileImage" src={this.state.url} alt="profile" />
           <PhotoUploader getUrl={this.getUrl}/>
        </div>
      );
    }
  }
}

TextFields.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextFields);
