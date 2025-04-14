import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Banner.css";
export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const toRotate = ["Make Transactions", "Generate NFTS"];
  const period = 2000;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [text]);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta((prevDelta) => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setDelta(period);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setDelta(500);
    }
  };
  return (
    <section className="banner" id="home">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} xl={7} md={6}>
            <span className="tagline">Welcome To Z-Wallet</span>
            <h1>{`Empower your investments `}</h1>
            <h2>
              <span className="wrap"> {text}</span>
            </h2>
            <p>
              Our Walet is a secure and user-friendly cryptocurrency wallet that
              allows you to manage your digital assets with ease
            </p>
            {/*<button className="learn-more align-items-center bannerBtn">*/}
            {/*  <span className="circle" aria-hidden="true">*/}
            {/*    <span className="icon arrow"></span>*/}
            {/*  </span>*/}
            {/*  <span className="button-text">Add Wallet</span>*/}
            {/*</button>*/}
          </Col>
          <Col xs={12} md={6} xl={5}>
            <img src={require("../assets/img/logo_banner.png")} alt="header" />
          </Col>
        </Row>
      </Container>
    </section>
  );
};
