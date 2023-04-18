import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
function ImageViewer(props) {
  return (
    <div className="">
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Cat</h4>
          <img src={props.image} alt="" />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ImageViewer;
