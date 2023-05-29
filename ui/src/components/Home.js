import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from 'react-router-dom';
import CreateNftScreen from "../screens/create-nft";
import NftScreen from '../components/nftScreen'
function Home(props) {
  const [ethPrice, setEthPrice] = useState(null);
  const [nftModal, setnftModal] = useState(false);

  async function getEthPriceInUSD() {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await response.json();

      const ethPriceInUSD = data.ethereum.usd;
      setEthPrice(props.userBalance * ethPriceInUSD);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  useEffect(() => {
    getEthPriceInUSD();
    props.getzcoinBalance()
  }, [getEthPriceInUSD,]);
  const handlenft = () => {
    setnftModal(true);
  };

  const handlenftModalClose = () => {
    setnftModal(false);
  };
  return (
    <div
      id="Home"
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Container>
        <Row>
          <Col
            className="card text-white mb-3 card_info"
            style={{ maxWidth: "60rem" }}
          >
            <div className="card-header text-center">Account 1</div>
            <div className="card-body">
              <div className="network-address">
                <div className="d-flex ">
                  <p
                    className="card-title text-start "
                    style={{ flexBasis: "30%" }}
                  >
                    Network Id :
                  </p>
                  <p
                    className="card-title text-center"
                    style={{ flexBasis: "70%" }}
                  >
                    {props.networkname}
                  </p>
                </div>
                <div className="d-flex ">
                  <p
                    className="card-title text-start "
                    style={{ flexBasis: "30%" }}
                  >
                    Public Address
                  </p>
                  <p
                    className="card-title text-center"
                    style={{ flexBasis: "70%" }}
                  >
                    {props.userAddress}
                  </p>
                </div>
              </div>
              <div className="balance-info mt-5 mb-5">
                <div className="card-text text-center">
                  <span className="balance fw-bold fs-2">
                    {props.userBalance} ETH
                  </span>
                  <br />
                  <span className="usd-equivalent fs-5">${ethPrice}</span>
                  <br />
                  <span className="balance fw-bold fs-2">{props.ZcoinBalance} ZTK</span>
                  <br />
                  <div className="action-buttons row justify-content-center mt-1">
                    <div className="col-md-3 col-sm-6 mb-1 w-100">
                      <button
                        className="rounded-pill w-100"
                        onClick={() => {
                          props.connectHandler()
                          props.getzcoinBalance()
                        }}
                      >
                        Get Updated
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="action-buttons row justify-content-center mt-5">

                <div className="col-md-6 col-sm-6 mb-3">
                  <button className="rounded-pill w-100" onClick={props.BuyToken}>Buy</button>
                </div>
                <div className="col-md-6 col-sm-6 mb-3">
                  <button className="rounded-pill w-100" onClick={handlenft}>NFT</button>
                </div>
                <NftScreen show={nftModal} onHide={handlenftModalClose} />
              </div>
            </div>
          </Col>

          <Col xs={12} md={6} xl={5}>
            <img src={require("../assets/img/logo_banner.png")} alt="header" />
          </Col>
        </Row>
      </Container>
      <CreateNftScreen />
    </div>
  );
}

export default Home;
