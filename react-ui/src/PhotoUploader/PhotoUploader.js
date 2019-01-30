// import React from 'react';
import React, { Component } from "react";
import axios from "axios";
import '../App.css';
import { withStyles } from '@material-ui/core/styles';

///prevent refresh of page
//make spot in database for url
//require url to be completed
const styles = {
  button:{
    backgroundColor: 'orange',
    textColor: 'gray',
    height: 50,
    width: 100,
    borderRadius: 35,
    opacity: 50 
  },
}
class PhotoUploader extends Component {
  //setting the state as null 
  state = { selectedFile: null };
  constructor(props){
    super(props)

    this.uploadHandler=this.uploadHandler.bind(this)
  }
  //re-setting the state with the selected file to be whatever the target file at index 0 is (Whatever file we choose  to upload)
  fileChangedHandler = event => {
    this.setState({ selectedFile: event.target.files[0] });
    // this.uploadHandler();
  };
  uploadHandler = (e) => {
    e.preventDefault()
    //changes form data to a new class
    const formData = new FormData();
    //adding next couple lines to the form data class
    formData.append(
      "profile_pic",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
      //axios call to the backend that posts it to S3 pinder bucket, then pings back as a url response
    axios.post("/imageUpload", formData, {
      onUploadProgress: progressEvent => {
        console.log(progressEvent.loaded / progressEvent.total);
      }
    }).then((response)=>{
      this.props.getUrl(response.data.url)
    })
  };
  //rendering (and just displaying those parts)
  render() {
    // console.log(this.props)
    return (
      <div>

        <input type="file" onChange={this.fileChangedHandler} />

        <button className={this.props.classes.button} onClick={this.uploadHandler}>Upload Photo!</button>
        
      </div>
    );
  
    }
  }

export default withStyles(styles)(PhotoUploader);

