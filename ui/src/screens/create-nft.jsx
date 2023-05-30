import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import "./create-nft.css";
import { createImage, uploadImage , getURL} from "../utilities/nft-service";
import Web3 from "web3";

export default function CreateNftScreen(props) {
  let [status, setStatus] = React.useState("");
  let [image, setImage] = React.useState("");
  let [errorMessage, setErrorMessage] = React.useState(null);
  let [formData, setFormData] = React.useState({
    name: null,
    description: null,
    cost: null,
    isForSale: null,
    mintWithZTK: null,
  });
  let nftImageData;
  let [nftImage, setNftImage] = React.useState(null);
  const handleInputChange = async (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue =
      type === "checkbox" || type === "switch" ? checked : value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: inputValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.name === null ||
      formData.description === null ||
      formData.cost === null //||
      //formData.isForSale === null ||
      //formData.mintWithZTK === null
    ) {
      setErrorMessage("please fill all form fields");
    } else {
      setStatus("generating nft image");
      let [imageData, nft] = await createImage(formData.description);
      nftImageData = imageData;
      setNftImage(nft);
      setStatus("ready for minting");
    }
  };
  const mintNFT = async () => {
    setStatus("storing NFT in IPFS");
    const url = await uploadImage(
      nftImage,
      formData.description,
      formData.name
    );
    setStatus("minting NFT");
    await props.createNFTHandler(url,formData);
    setStatus("NFT minted successfuly");
  };
  return (
    <div className="image-generator">
      <form className="form">
        <span className="title">Create your own NFT</span>
        <p className="description">
          fill the form and create your awesome AI generated NFT
        </p>
        <div className="inputs">
          <input
            type="text"
            value={formData.name}
            name="name"
            placeholder="my awesome NFT name"
            onChange={handleInputChange}
          />
          <input

            type="text"
            value={formData.description}
            name="description"
            onChange={handleInputChange}
            placeholder="my awesome NFT description"
          />
          <input
            type="number"
            value={formData.cost}
            name="cost"
            onChange={handleInputChange}
            placeholder="my awesome NFT price"
          />
          <div className="radio">
            <label className="radio-label">Make this NFT for sale</label>
            <input
              className="radio-btn"
              placeholder="make this NFT for sale"
              type="checkbox"
              name="isForSale"
              onClick={() => setFormData((previousData) => {return {...previousData , isForSale : !previousData.isForSale}})}
            />
          </div>
          <div className="radio">
            <label className="radio-label">Mint this NFT with ZTK</label>
            <input
              className="radio-btn"
              placeholder="mint this NFT with ZTK"
              type="checkbox"
              name="mintWithZTK"
              onClick={() => setFormData((previousData) => { return { ...previousData, mintWithZTK: !previousData.mintWithZTK } })}
            />
          </div>
          <Button
            className="btn-btn"
            variant="primary"
            type="submit"
            onClick={handleSubmit}
          >
            Create NFT
          </Button>
          <Button variant="primary" className="btn-btn" onClick={mintNFT}>
            Mint NFT
          </Button>
        </div>
      </form>
      <div className="image-container ">
        <div className="image">
          {nftImage ? (
            <img src={nftImage} alt="AI generated image" />
          ) : (
            <Spinner className="spinner" animation="border" role="status">
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
