import React from "react";
import "react-multi-carousel/lib/styles.css";
import { getURL } from "../utilities/nft-service";
import "./nftScreen.css";

function NftScreen(props) {
  const [nft, setNFT] = React.useState({});

  const initialise = async () => {
    const data = await props.getNFT();
    setNFT(data);
  };
  const buyNFT = async () => {
    try {
      const test = await props.buyNFT(nft.id);
      console.log("NFT purchased successfully", test);
    } catch (error) {
      console.error("Error purchasing NFT:", error.message);
    }
  };

  React.useEffect(() => {
    initialise();
  }, []);

  return (
    <div className="card">
      <div className="infos">
        <div className="image">
          {nft.uri && (
            <img
              src={nft.uri}
              alt="nft"
              height={250}
              width={250}
              className="nftimage"
            />
          )}
        </div>
        <div className="info">
          <div>
            <p className="name">{nft.name ?? "loading..."}</p>
            <p className="function">{nft.description ?? "loading..."}</p>
          </div>
          <div className="stats">
            <p className="flex">Cost : {nft.cost ?? "loading..."}</p>
          </div>
        </div>
      </div>
      <button
        className="nftbutton request"
        disabled={!nft.isForSale || props.user === nft.owner}
        onClick={buyNFT}
      >
        Buy
      </button>
      <button className="nftbutton request" onClick={initialise}>
        Next NFT
      </button>
    </div>
  );
}

export default NftScreen;
