import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export function SendModal(props) {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const handleSend = () => {
    // Handle send functionality here
    console.log("Sending", amount, "tokens to", address);
    setAddress("");
    setAmount("");
    props.onHide();
  };

  return (
    <Modal show={props.show} onHide={props.onHide} className="model">
      <Modal.Header className="justify-content-center">
        <Modal.Title className="title">Send Tokens</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="form">
          <Form.Group controlId="formAddress">
            <Form.Label className="label">Recipient Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address"
              className="form-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formAmount">
            <Form.Label className="label">Amount</Form.Label>
            <Form.Control
              type="number"
              className="form-input"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="justify-content-center ">
        <Button className="w-25 btn" variant="secondary" onClick={props.onHide}>
          Cancel
        </Button>
        <Button className=" w-25 btn" variant="primary" onClick={handleSend}>
          Send
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
