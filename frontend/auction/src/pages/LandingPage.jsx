import React from "react";
import { Container, Button, Image, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import heroImage from "../assets/images/2.jpg";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const LandingPage = () => {
  return (
    <Container className="text-center mt-5">
      {/* Hero Section */}
      <div className="mb-5">
        <h1 className="display-4">Welcome to the Auction App</h1>
        <p className="lead">The best place to buy and sell items through auctions.</p>
      </div>

      {/* Hero Image */}
      <Row className="justify-content-center mb-5">
        <Col md={8}>
          <Image
            src={heroImage}
            alt="Auction Hero"
            fluid
            rounded
            className="shadow"
          />
        </Col>
      </Row>

      {/* Call-to-Action Buttons */}
      <div className="mt-4 mb-5">
        <Button as={Link} to="/signin" variant="primary" className="m-2" size="lg">
          Sign In
        </Button>
        <Button as={Link} to="/signup" variant="secondary" className="m-2" size="lg">
          Sign Up
        </Button>
      </div>

      {/* About Section */}
      <Row className="mb-5">
        <Col md={8} className="mx-auto">
          <h2 className="mb-4">About Us</h2>
          <p className="text-muted">
            The Auction App is a platform where you can buy and sell unique items through a seamless auction process. Whether you're looking for rare collectibles, electronics, or art, our app connects you with sellers worldwide. Join us today and experience the thrill of bidding!
          </p>
        </Col>
      </Row>

      {/* Contact Section */}
      <Row className="mb-5">
        <Col md={8} className="mx-auto">
          <h2 className="mb-4">Contact Us</h2>
          <Card className="shadow">
            <Card.Body>
              <p className="text-muted">
                <FaMapMarkerAlt className="me-2" />
                123 Auction Street, Bid City, BC 12345
              </p>
              <p className="text-muted">
                <FaEnvelope className="me-2" />
                support@auctionapp.com
              </p>
              <div className="d-flex justify-content-center mt-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="me-3">
                  <FaFacebook size={24} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="me-3">
                  <FaTwitter size={24} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <FaInstagram size={24} />
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Footer */}
      <footer className="py-4 bg-light mt-5">
        <p className="text-muted mb-0">
          &copy; {new Date().getFullYear()} Auction App. All rights reserved.
        </p>
      </footer>
    </Container>
  );
};

export default LandingPage;
