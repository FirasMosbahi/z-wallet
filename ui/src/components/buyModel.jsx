import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./buyModel.css";
export default function BuyModel(props) {
  const [amount, setAmount] = useState("");

  const handleBuy = () => {
    props.onclick(amount);
    props.onHide();
  };

  return (
    <Modal show={props.show} onHide={props.onHide} className="model">
      <Modal.Header className="justify-content-center">
        <Modal.Title className="title">Buy Tokens</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="formModel">
          <Form.Group controlId="formAddress">
            <Form.Label className="label">Amount To Transfer</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount"
              className="form-input"
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="justify-content-center ">
        <Button className=" w-25 btn" variant="primary" onClick={handleBuy}>
          Buy
        </Button>
        <Button className="w-25 btn" variant="secondary" onClick={props.onHide}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
