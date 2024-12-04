import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import "./create-nft.css";
import { createImage, uploadImage } from "../utilities/nft-service";
import Web3 from "web3";

export default function CreateNftScreen(props) {
  let [status, setStatus] = React.useState("");
  let [errorMessage, setErrorMessage] = React.useState(null);
  let [formData, setFormData] = React.useState({
    name: "",
    description: "",
    cost: "",
    isForSale: false,
    mintWithZTK: false,
  });
  let [nftImage, setNftImage] = React.useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.cost) {
      setErrorMessage("Please fill all form fields");
    } else {
      setStatus("Generating NFT image");
      let [imageData, nft] = await createImage(formData.description);
      setNftImage(nft);
      setStatus("Ready for minting");
    }
  };

  const mintNFT = async () => {
    setStatus("Storing NFT in IPFS");
    const url = await uploadImage(
      nftImage,
      formData.description,
      formData.name
    );
    setStatus("Minting NFT");
    await props.createNFTHandler(url, formData);
    setStatus("NFT minted successfully");
  };

  return (
    <div className="image-generator">
      <form className="form" onSubmit={handleSubmit}>
        <span className="title">Create your own NFT</span>
        <p className="description">
          Fill the form and create your awesome AI-generated NFT
        </p>
        <div className="inputs">
          <input
            type="text"
            value={formData.name}
            name="name"
            placeholder="My awesome NFT name"
            onChange={handleInputChange}
          />
          <input
            type="text"
            value={formData.description}
            name="description"
            placeholder="My awesome NFT description"
            onChange={handleInputChange}
          />
          <input
            type="number"
            value={formData.cost}
            name="cost"
            placeholder="My awesome NFT price"
            onChange={handleInputChange}
          />
          <div className="radio">
            <label className="radio-label">Make this NFT for sale</label>
            <input
              className="radio-btn"
              type="checkbox"
              name="isForSale"
              checked={formData.isForSale}
              onChange={handleInputChange}
            />
          </div>
          <div className="radio">
            <label className="radio-label">Mint this NFT with ZTK</label>
            <input
              className="radio-btn"
              type="checkbox"
              name="mintWithZTK"
              checked={formData.mintWithZTK}
              onChange={handleInputChange}
            />
          </div>
          <Button variant="primary" type="submit">
            Create NFT
          </Button>
          <Button variant="primary" onClick={mintNFT}>
            Mint NFT
          </Button>
        </div>
      </form>
      <div className="image-container">
        <div className="imageNFt">
          {nftImage ? (
            <img
              src={nftImage}
              alt="AI generated image"
              className="imageNFtimg"
              height={450}
              width={400}
            />
          ) : (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
        </div>
        <div className="status">
          {errorMessage ? <p>{errorMessage}</p> : <p>{status}</p>}
        </div>
      </div>
    </div>
  );
}
