import React, { useState, useEffect } from "react";
import { Container, Card, Button, Alert, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../utils/api";

const Dashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [minBid, setMinBid] = useState("");
  const [maxBid, setMaxBid] = useState("");

  // Fetch auctions with search and filters
  const fetchAuctions = async () => {
    try {
      const { data } = await api.get("/auctions", {
        params: { search, status, minBid, maxBid },
      });
      setAuctions(data);
    } catch (err) {
      setError("Failed to load auctions");
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [search, status, minBid, maxBid]); // Re-fetch when filters change

  const addToWatchlist = async (auctionId) => {
    try {
      await api.post(`/watchlist/${auctionId}`);
    } catch (err) {
      console.error("Error adding to watchlist:", err);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Active Auctions</h2>

      {/* Search and Filters */}
      <Card className="mb-4 p-3">
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search by title or description"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="ended">Ended</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Control
                  type="number"
                  placeholder="Min Bid"
                  value={minBid}
                  onChange={(e) => setMinBid(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Control
                  type="number"
                  placeholder="Max Bid"
                  value={maxBid}
                  onChange={(e) => setMaxBid(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {auctions.length === 0 ? (
        <p>No auctions available</p>
      ) : (
        auctions.map((auction) => (
          <Card key={auction._id} className="mb-3">
            {/* Display the auction image */}
            {auction.image && (
              <Card.Img
                variant="top"
                src={`http://localhost:3000/${auction.image}`}
                alt={auction.title}
                style={{ height: '200px', objectFit: 'cover' }}
              />
            )}
            <Card.Body>
              <Card.Title>{auction.title}</Card.Title>
              <Card.Text>Current Bid: ${auction.currentBid}</Card.Text>
              <Card.Text className="text-muted">
                Ends: {new Date(auction.endTime).toLocaleString()}
              </Card.Text>
              <div className="d-flex gap-2">
                <Link to={`/auction/${auction._id}`}>
                  <Button variant="primary">View Details</Button>
                </Link>
                <Button
                  variant="outline-secondary"
                  onClick={() => addToWatchlist(auction._id)}
                >
                  Watch
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Dashboard;
