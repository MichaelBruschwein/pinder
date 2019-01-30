import React, { Component } from 'react';
import './Profile.css';
import EditableLabel from 'react-inline-editing';
// import { Redirect } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Dialog from './../Dialog.js';
import PhotoUploader from '../PhotoUploader/PhotoUploader';
import '../App.css';
import {
    withRouter
} from 'react-router-dom'
import { orange } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';

const styleSheet = {
    button:{
        backgroundColor: 'orange',
        textColor: 'gray',
        height: 50,
        width: 100,
        borderRadius: 35,
        opacity: 50,
      },
    card: {
        maxWidth: 1590,
        borderRadius: 35, 
        backgroundColor: 'dim gray',
    },
}

class Profile extends Component {
    constructor(props) {
        super(props);
        // console.log(this.props.userInfo)
        this.state = {
            open: false,
            user: {
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
        }
        this._handleFocus = this._handleFocus.bind(this);
        this._handleFocusOut = this._handleFocusOut.bind(this);
        this.deleteProfile = this.deleteProfile.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.profileItems = this.profileItems.bind(this);
        this.getUrl = this.getUrl.bind(this);
    }
    componentDidMount() {
        axios.get('/user', 
          {
            headers: {'Authorization': `Bearer ${localStorage.getItem('pinder_token')}`}
          }).then((response) => {
            this.setState({ user: response.data.user })
        }).catch((err) => {
             alert(err)
            this.props.history.push('/login')
        })
    }

    _handleFocus(key, text) {
        console.log('Focused on ' + key + ' which contains ' + text);
    }

    _handleFocusOut(key, text) {
        this.setState(prevState => ({
            user: {
                ...prevState.user,
                [key]: text
            }
        }))
        // this.props.updateState(this.state)
    }

    getUrl(url) {
        this.setState({
            url: url
        });
    }

    deleteProfile(user) {
        axios.delete(`/deleteUser`, {headers: { 'Authorization': `Bearer ${localStorage.getItem('pinder_token')}` }})
            .then((response) => {
                // this.props.logout()
                //meow meow meow this dont work meow
            })
            .catch(function (error) {
                // this.props.logout()
                console.log(error);
            });
    }

    updateProfile(user) {
        axios.put(`/updateUser`, 
         {
            username: user.username,
            email: user.email,
            password: user.password,
            name: user.name,
            species: user.species,
            sex: user.sex,
            city: user.city,
            state: user.state,
            age: user.age,
            bio: user.bio,
            url: user.url
        },{headers: { 'Authorization': `Bearer ${localStorage.getItem('pinder_token')}` }}
        )
            .then((response) => {
                console.log('Updated Profile')
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    profileItems() {
        let i = 0;
        let displayValue = ''
        return (
            Object.values(this.state.user).map(
                (val) => {
                    let keyName = Object.keys(this.state.user)[i]
                    i++

                    if (keyName === 'password') {
                        displayValue = '************';
                    } else {
                        displayValue = val;
                    }
                    // Emit the following keys
                    if (keyName === 'url') {
                        return (<div><img className='profileImage' src={displayValue} alt="profile pic" /></div>)

                    } else if (keyName === 'id' || keyName === 'created_at' || keyName === 'updated_at') {
                        // key is important for react to keep track of what updated
                        return (<div key={i.toString()}></div>)
                        // if you wanted to use these properties you could do so here. but we dont want to display them
                    } else {
                        return (
                            // key is important for react to keep track of what updated
                            <div className='row' key={i.toString()}>
                                <div className="column">
                                    <span className="label">{keyName} </span>
                                    <Divider />
                                </div>
                                <div className="column">
                                    <EditableLabel
                                        key={displayValue.toString()}
                                        text={displayValue.toString()}
                                        labelClassName='myLabelClass'
                                        inputClassName='myInputClass'
                                        inputMaxLength={50}
                                        onFocus={this._handleFocus.bind(this, keyName)}
                                        onFocusOut={this._handleFocusOut.bind(this, keyName)}
                                    />
                                    <Divider />
                                </div>
                            </div>
                        )
                    }
                })
        )
    }
    render() {
        console.log(this.props)
        return (
            <div className="container"
                style={{ paddingTop: '5%' }}>
                <Card className={this.props.classes.card}>
                {/* className={this.props.classes.button} */}
                    {this.profileItems()}
                    <PhotoUploader getUrl={this.getUrl} />
                    <Grid container justify="space-between">
                        <Grid item>
                            <Dialog
                                buttonName={'Delete Profile'}
                                buttonType={'primary'}
                                title={'Delete Profile'}
                                dialog={'Are you sure you want to Delete Your Profile? This cannot be Undone!'}
                                confirm={'Delete'} deny={'Cancel'}
                                action={this.deleteProfile}
                                user={this.state.user}
                            />
                        </Grid>
                        <Grid item>
                            <Dialog
                                buttonName={'Update Profile'}
                                buttonType={'secondary'}
                                title={'Update Profile'}
                                dialog={'Are you sure you want to Update Your Profile?'}
                                confirm={'Update'}
                                deny={'Cancel'}
                                action={this.updateProfile}
                                user={this.state.user}
                            />
                        </Grid>
                    </Grid>
                </Card >
            </div >
        )

    }
}

export default withRouter(withStyles(styleSheet)(Profile))
