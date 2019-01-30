import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import '../App.css';
import './Finder.css';
import {
    withRouter
} from 'react-router-dom'

const styles = {
    card: {
        maxWidth: 1590,
        borderRadius: 35, 
        backgroundColor: 'dim gray',
    },
    // formatting the pic below... on finder page, kind of?
    media: {
        paddingTop: '75.25%',
        paddingBottom: '-76%',
        borderRadius: 35,
    },
    text: {
        fontSize: 44
    },
    button:{
        backgroundColor: 'orange',
        textColor: 'gray',
        height: 50,
        width: 100,
        borderRadius: 35,
        opacity: 50 
      },
};
class Finder extends React.Component {
    constructor(props) {
        super(props)
        this.classes = props;
        this.state = {
            userToBeDisplayed: {
                name: "loading please wait...",
                sex: "",
                age: "",
                city: "",
                state: "",
                bio: "",
                url: ""
            },
            isUserOne: false,
            userId: null,
            sadPuppy: false
        }
        this.likesUser = this.likesUser.bind(this)
        this.getNewMatch = this.getNewMatch.bind(this)
    }
    componentDidMount() {
        this.getNewMatch()
    }
    likesUser(like) {
        axios.put('/like', {
            user2: this.state.userToBeDisplayed.id,
            like: like,
            isUser2: this.state.isUserOne
        }, {headers: { 'Authorization': `Bearer ${localStorage.getItem('pinder_token')}` }})
        .then((response) => {
            this.getNewMatch()
            if (response.data.message === "matched") {
                alert("HEY Hey hey")
            }
        }).catch((error) => {
            console.log(error)
        })

    }
    getNewMatch() {
        axios.get('/match',
            {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('pinder_token')}` }
            }).then((response) => {
                if (response.data.message === "empty") {
                    this.setState({
                        sadPuppy: true
                    })
                    // alert("Thats ruff, there are no more matches")
                    //reroute here
                } else {
                    this.setState({
                        userToBeDisplayed: response.data.userToBeDisplayed,
                        isUserOne: response.data.isUserOne,
                        userId:response.data.userCurrentlyLoggedIn.id

                    })
                }

            }).catch((err) => {
                alert(err)
               this.props.history.push('/login')
           })
    }

    render() {
        if (this.state.sadPuppy) {
            return (<div>
                <h1> That's Ruff No New Matches Please Check Back Later</h1>
                <img src="https://i.ytimg.com/vi/R7K-crxH2J0/hqdefault.jpg" alt="cute dog"></img>
            </div>)
        } else {
            return (
                <div
                    style={{
                        paddingTop: '5%'
                    }}
                >
                    <Grid
                        container
                        justify="center"
                        alignItems="center">
                        <Card className={this.props.classes.card}>
                            <CardActionArea>
                                <CardMedia
                                    className={this.props.classes.media}
                                    image={this.state.userToBeDisplayed.url}
                                    title="Contemplative Reptile"
                                />
                                <CardContent className= {this.props.classes.card}>

                                    {this.state.userToBeDisplayed.name},
                                    {this.state.userToBeDisplayed.sex},
                                    {this.state.userToBeDisplayed.age},
                                    {this.state.userToBeDisplayed.city + " " + this.state.userToBeDisplayed.state},
                                    {this.state.userToBeDisplayed.bio}

                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Grid
                                    container
                                    alignItems="flex-end"
                                >
                                    <Button className={this.props.classes.button} onClick={(e) => this.likesUser(false)} size="large" variant="contained" color="secondary">
                                        Dislike
                                    </Button>
                                </Grid>
                                <Button className={this.props.classes.button} onClick={(e) => this.likesUser(true)} size="large" variant="contained" color="primary">
                                    Like
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </div>
            );
        }
    }
}

Finder.propTypes = {
    classes: PropTypes.object.isRequired,
};

//export default withStyles(styles)(MediaCard);
export default withRouter(withStyles(styles)(Finder));
//Make a axios post call to database to create and search for matches
//We get a response from database and setstate of matches to equal the ids from database
//