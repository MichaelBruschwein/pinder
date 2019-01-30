import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import axios from 'axios'

const styles = {
    card: {
        minWidth: 250,
        minHeight: 250,
        maxWidth: 500,
        maxHeight: 500,
        borderRadius: 50,

        backgroundColor: "aquamarine"
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    media: {
        textAlign: "center",
    },
    image: {
        padding: "10px",
        borderRadius: 110,
        height: 200,
        width: 200,
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    top: {
        padding: 10,
    }

};

class SimpleCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username:"Sick Puppy",
            url:"https://nhl.bamcontent.com/images/photos/301406224/1024x576/cut.jpg"
        }
    }
    componentDidMount(){
        axios.get('/matches', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('pinder_token')}` }
        }).then((response) =>{
            this.setState({
                username:response.data.username,
                url:response.data.url
            })
        })
    }
    render() {
        return (
            <Grid className={this.props.classes.top} container justify="center" spacing="16">
                <Grid item="true">
                    <Card className={this.props.classes.card}>
                        <img className={this.props.classes.image} src={this.state.url} alt="lizard" />
                        <CardContent>
                            {this.state.username}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        );
    }
}

SimpleCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleCard);