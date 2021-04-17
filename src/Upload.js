import React, { Component } from "react";
import Dropzone from 'react-dropzone'

import './Upload.css';

export default class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: "",
            buttonText: "Select File to Submit",
        }
        this.handleUpload = this.handleUpload.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.buttonText = "Select File to Submit";
        this.string = "";
    }


    // Handles file upload event and updates state
    handleUpload(event) {
        console.log(event.target.files[0].name);
        console.log(event.target.files[0].type);
        console.log(event.target.files[0].size);
        let reader = new FileReader();
        reader.onload = function (event) {
            // The file's text will be printed here
            console.log(event.target.result)
        };

        reader.readAsText(event.target.files[0]);
        this.setState({
            file: event.target.files[0]
        });

    }

    onClick = () => {
        console.log(this.string);
    }

    // After selecting a file, set button stuff
    onDrop = (acceptedFiles) => {
        if (acceptedFiles.length === 1) {
            this.buttonText = "Submit: " + acceptedFiles[0].name.substr(0, 12) + (acceptedFiles[0].name.length > 12 ? "..." : "");
            let string = "";
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                string = reader.result
                this.string = string;  
            }
            reader.readAsText(acceptedFiles[0]);
            this.setState({
                buttonText: "Submit: " + acceptedFiles[0].name.substr(0, 6) + (acceptedFiles[0].name.length > 6 ? "..." : ""),
            })
        } else {
            console.log("no");
            this.setState({
                buttonText: "Select Valid File to Submit"
            });
        }
    }

    render() {
        return (
            <div className="Container">
                <h1 className="h2">Upload Game PGN</h1>
                <div>
                    <Dropzone onDrop={this.onDrop}>
                        {({ getRootProps, getInputProps }) => (
                            <section>
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <h1 classname="myButtonUpload">Drag 'n' drop some files here, or click to select files</h1>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                </div>
                <div>
                    <button className="myButtonUpload" onClick={this.onClick}>{this.buttonText}</button>
                </div>
                
            </div>
        );
    }
}
