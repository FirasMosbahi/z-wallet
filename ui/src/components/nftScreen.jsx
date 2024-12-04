import React from 'react';
import 'react-multi-carousel/lib/styles.css';
import { getURL } from '../utilities/nft-service';
import './nftScreen.css'

function NftScreen(props) {
  const [nft, setNFT] = React.useState({});
  const [nftImg, setNftImg] = React.useState({});

  const initialise = async () => {
    const data = await props.getNFT();
    const imageData = await getURL(data.uri);
    setNFT({ ...data });

    //  const response = await axios.get(data.uri);
    //  const imageData = await response.data;
    setNftImg(imageData);
  };
  const buyNFT = async () => {
    const test = await props.buyNFT(nft.id);
  }

  React.useEffect(() => {
    initialise();
  }, []);

  return (

    <div className="card">
      <div className="infos">
        <div className="image">
          {nftImg && (
            <img src={nftImg} alt="nft" height={250} width={250} className='nftimage' />
          )}
        </div>
        <div className="info">
          <div>
            <p className="name">
              {nft.name ?? 'loading...'}
            </p>
            <p className="function">
              description: {nft.description ?? 'loading...'}
            </p>
          </div>
          <div className="stats">
            <p className="flex">
              Cost
              <span className="state-value">
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
