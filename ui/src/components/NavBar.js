import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState,useEffect } from 'react';
function NavBar(props) {
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  }
  
  return (
    <Navbar expand="lg" className={scrolled ? "scrolled" : "" } >
      <Container>
        <Navbar.Brand href="/">
          <h1>Z-WALLET</h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <br />
            <Nav.Link href="#home" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>Home</Nav.Link>
            <br />
            <Nav.Link href="#history" className={activeLink === 'history' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('history')}>Transaction History</Nav.Link>
            <br />
            <Nav.Link href="#Contact" className={activeLink === 'Contact' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('Contact')}>Contact</Nav.Link>
            <br />
          </Nav>
          <br />
          <Nav className=' navbar-text'>
            <button className="vvd" onClick={props.connectHandler} >
              <span>
                 {props.connButtonText}
              </span>
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
