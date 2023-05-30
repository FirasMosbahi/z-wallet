import React from 'react';
import { Modal, Button, Form, Card } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios';
import { getURL } from '../utilities/nft-service';

function NftScreen(props) {
  const [nft, setNFT] = React.useState({});
  const [nftImg, setNftImg] = React.useState({});

  const initialise = async () => {
    const data = await props.getNFT();
    const imageData = await getURL(data.uri);
    console.log(data);
    console.log(imageData);
    setNFT({...data});

  //  const response = await axios.get(data.uri);
  //  const imageData = await response.data;
    setNftImg(imageData);
  };

  React.useEffect(() => {
    initialise();
  }, []);

  return (
    <Modal show={props.show} onHide={props.onHide} className="model">
      <div className="cardNft">
        <div className="card-border-top"></div>
        <div className="img">
          {nftImg && (
            <img src={nftImg} alt="nft" height={250} width={250} className='nftimage'/>
          )}
        </div>

        <span>Person</span>
        <p className="job">name: {nft.name ?? 'loading...'}</p>
        <p className="job">description: {nft.description ?? 'loading...'}</p>
        <p className="job">cost: {nft.cost ?? 'loading...'}</p>
        <button className="nftbutton" disabled={!nft.isForSale}>
          Buy
        </button>
        <button className="nftbutton" onClick={initialise}>
          Next NFT
        </button>
      </div>
    </Modal>
  );
}

export default NftScreen;
