import React from 'react';
import { Modal, Form, Button, FormFile } from 'react-bootstrap';
import { CloneObject } from '../../../../utils/utils';

import "./AddImagePopUp.scss";

export default class AddImagePopUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopUp: false,
            imageData: null,
        }
    }

    componentDidMount() {
        window["dataImage"] = null;
        window["imageUploader"] = this;
        window.addEventListener("openImageUploader", () => this.handleShowPopUp());
    }

    event = new Event('openImageUploader');

    dispatchEvent() {
        window.dispatchEvent(this.event);
        return "Hello World"
    }

    retrieveDataToGodot() {
        return window.dataImage;
    }

    dispatchClosePopUp(){
        this.handleClosePopUp()
    }

    handleShowPopUp() {
        window["dataImage"] = null;
        this.setState({ showPopUp: true })
    }

    handleClosePopUp() {
        this.setState({showPopUp: false});
    }

    handleAddImageData(imageData) {
        this.setState({ imageData: imageData.target.files[0] });
    }

    submitImage(event) {
        event.preventDefault();
        const reader = new FileReader();
        const isPng = this.state.imageData.type === "image/png" ? true : false;

        reader.addEventListener("load", function (data) {
            let base64Image = data.originalTarget !== undefined ? data.originalTarget.result : data.currentTarget.result;
            
            if(isPng){
                base64Image = base64Image.replace("data:image/png;base64,", "");
            }else{
                base64Image = base64Image.replace("data:image/jpeg;base64,", "");
            }

            window["dataImage"] = base64Image;
        });

        reader.readAsDataURL(this.state.imageData);
    }

    render() {
        const { showPopUp } = this.state;
        return (
            <Modal show={showPopUp} onHide={()=> this.handleClosePopUp()} className="AddImageContainer" size="lg" backdrop="static" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Image</Modal.Title>
                </Modal.Header>

                <Modal.Body className="modalBody">
                    <Form onSubmit={(e) => this.submitImage(e)}>
                        <Form.Group>
                            <Form.File className="formFile" id="exampleFormControlFile1" label="Example file input" onChange={(e) => this.handleAddImageData(e)} />
                        </Form.Group>
                        {/* <img src={URL.createObjectURL(this.state.imageData)}/> */}

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }

}
