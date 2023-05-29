import React from 'react'
import { Modal, Button, Form } from "react-bootstrap";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
function NftScreen(props) {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };
  return (
    <Modal show={props.show} onHide={props.onHide} className="model">
      <section className="skill" id="skills">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="skill-bx wow zoomIn">
                <h2>NFTs</h2>
                <Carousel responsive={responsive} infinite={true} className="owl-carousel owl-theme skill-slider">
                 <div>
                  1
                 </div>
                  <div>
                    2
                  </div>
                  <div>
                    3
                  </div>
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </section>
        
      </Modal>
  );
}

export default NftScreen
