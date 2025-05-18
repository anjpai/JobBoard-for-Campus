import React from 'react';
import Navbar from 'react-bootstrap/Navbar';

const Footer = () => {
  return (
    <footer style={{ paddingTop: 75 }}>
      <Navbar
        className="shadow-sm justify-content-center footer"
        fixed="bottom"
      >
        <Navbar.Text>
          © 2024{' '}
          <span className="text-white">Anjali R Pai</span>
        </Navbar.Text>
      </Navbar>
    </footer>
  );
};

export default Footer;
