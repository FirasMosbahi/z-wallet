import React from 'react';
import { Modal, Button, Form, Card } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios';
import { getURL } from '../utilities/nft-service';
import './nftScreen.css'

function NftScreen(props) {
  const [nft, setNFT] = React.useState({});
  const [nftImg, setNftImg] = React.useState({});

  const initialise = async () => {
    const data = await props.getNFT();
    const imageData = await getURL(data.uri);
    console.log(data);
    console.log(imageData);
    setNFT({ ...data });

    //  const response = await axios.get(data.uri);
    //  const imageData = await response.data;
    setNftImg(imageData);
  };
  const buyNFT = async () => {
    console.log("start buying");
    console.log(nft.id);
    const test = await props.buyNFT(nft.id);
    console.log(test);
    console.log("nft bought successfuly");
  }

  React.useEffect(() => {
    initialise();
  }, []);

  return (

    <div class="card">
      <div class="infos">
        <div class="image">
          {nftImg && (
            <img src={nftImg} alt="nft" height={250} width={250} className='nftimage' />
          )}
        </div>
        <div class="info">
          <div>
            <p class="name">
              {nft.name ?? 'loading...'}
            </p>
            <p class="function">
              description: {nft.description ?? 'loading...'}
            </p>
          </div>
          <div class="stats">
            <p class="flex">
              Cost
              <span class="state-value">
                {nft.cost ?? 'loading...'}
              </span>
            </p>

          </div>
        </div>
      </div>
      <button className="nftbutton request" disabled={!nft.isForSale || props.user === nft.owner} onClick={buyNFT}>
        Buy
      </button>
      <button className="nftbutton request" onClick={initialise}>
        Next NFT
      </button>
    </div>

  );
}

export default NftScreen;
