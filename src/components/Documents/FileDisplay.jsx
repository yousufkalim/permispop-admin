
import React, { Component } from "react";

class FileDisplay extends Component {

    render() {
        if (this.props.file !== undefined && this.props.file !== null) {

            if (this.props.file.indexOf(".pdf") > -1) {
                return (<iframe src={this.props.file} title="file_display" width="100%" height="100%" style={{ overflow: "auto" }}></iframe>);
            }
            else {
                return (<img style={{width:'100%',height:'100',overflow:'hidden'}} alt="image_file_here" src={(this.props.file!=="" || this.props.file !== null)?this.props.file:"http://160.153.244.127:82/CredentialFiles/placeholderimage.png"} />);
            }
        }
        else {
            return (<img style={{width:'100%',height:'100',overflow:'hidden'}} alt="image_file_here" src={"http://160.153.244.127:82/CredentialFiles/placeholderimage.png"} />);
        }
    }
}

export default FileDisplay;
