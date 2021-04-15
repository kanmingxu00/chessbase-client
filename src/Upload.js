import React, { Component } from "react";

export default class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: ""
        }
        this.handleUpload = this.handleUpload.bind(this);
    }


    // Handles file upload event and updates state
    handleUpload(event) {
        console.log(event.target.files[0].name);
        console.log(event.target.files[0].type);
        console.log(event.target.files[0].size);
        let reader = new FileReader();
        reader.onload = function(event) {
          // The file's text will be printed here
          console.log(event.target.result)
        };
      
        reader.readAsText(event.target.files[0]);
        this.setState({
            file: event.target.files[0]
        });
        
    }

    render() {
        return (
            <div>
                <div id="upload-box">
                    <input type="file" onChange={this.handleUpload} />
                    <p>Filename: {this.state.file.name}</p>
                    <p>File type: {this.state.file.type}</p>
                    <p>File size: {this.state.file.size} bytes</p>
                    {this.state.file && <ImageThumb image={this.state.file} />}
                </div>
            </div>
        );
    }
}

/**
 * Component to display thumbnail of image.
 */
const ImageThumb = ({ image }) => {
    return <img src={URL.createObjectURL(image)} alt={image.name} />;
};