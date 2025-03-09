import React, { useEffect, useState } from "react";
import { Container, Card, Alert, Image } from "react-bootstrap";
import api from "../utils/api";
import { useSpring, animated } from '@react-spring/web'; // Import React Spring

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await api.get("/watchlist");
        setWatchlist(response.data);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
        setError("Failed to load watchlist. Please try again.");
      }
    };

    fetchWatchlist();
  }, []);

  // Fade-in animation for each watchlist item
  const fadeInAnimation = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  return (
    <Container>
      <h2>My Watchlist</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {watchlist.length === 0 && !error ? (
        <Alert variant="info">Your watchlist is empty.</Alert>
      ) : (
        watchlist.map((item) => (
          <animated.div key={item._id} style={fadeInAnimation}>
            <Card className="mb-3">
              {/* Display the auction image */}
              {item.image && (
                <Card.Img
                  variant="top"
                  src={`http://localhost:3000/${item.image}`} // Use the full URL
                  alt={item.title}
                  style={{ height: '200px', objectFit: 'cover' }} // Adjust image styling
                />
              )}
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Card.Text><strong>Current Bid:</strong> ${item.currentBid}</Card.Text>
              </Card.Body>
            </Card>
          </animated.div>
        ))
      )}
    </Container>
  );
};

export default Watchlist;
