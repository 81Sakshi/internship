import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  ListGroup,
  Form,
  Alert,
  Spinner,
  Badge,
  Image,
} from "react-bootstrap";
import api from "../utils/api";
import moment from "moment";
import WinnerComponent from "../components/WinnerComponent";

const AuctionDetails = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState(""); // State for comment input
  const [comments, setComments] = useState([]); // State for comments

  useEffect(() => {
    fetchAuctionDetails();
    fetchComments();
  }, [id]);

  const fetchAuctionDetails = async () => {
    try {
      const response = await api.get(`/auctions/${id}`);
      setAuction(response.data);
    } catch (error) {
      console.error("Error fetching auction:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/${id}`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handlePlaceBid = async () => {
    if (!bidAmount || bidAmount <= auction.currentBid) {
      setError("Bid must be higher than current bid");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/bids/${id}`, { amount: bidAmount });
      setAuction(response.data);
      setBidAmount("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to place bid");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText) return;

    try {
      const response = await api.post(`/comments/${id}`, { text: commentText });
      setComments([...comments, response.data]);
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  return (
    <Container className="my-5">
      {auction ? (
        <Card className="shadow-lg">
          <Card.Body>
            {/* Display the auction image */}
            {auction.image && (
              <div className="text-center mb-4">
                <Image
                  src={`http://localhost:3000/${auction.image}`}
                  alt={auction.title}
                  fluid
                  rounded
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
            )}

            <Card.Title className="display-6 mb-4">{auction.title}</Card.Title>

            <div className="d-flex justify-content-between mb-4">
              <Badge bg="info" className="fs-5">
                Current Bid: ${auction.currentBid}
              </Badge>
              <Badge
                bg={auction.status === "active" ? "success" : "danger"}
                className="fs-5"
              >
                {auction.status === "active"
                  ? `Ends ${moment(auction.endTime).fromNow()}`
                  : "Auction Ended"}
              </Badge>
            </div>

            <Card.Text className="fs-5 mb-4">{auction.description}</Card.Text>

            {/* Display WinnerComponent only if the auction has ended and a winner exists */}
            {auction.status === "ended" && auction.winner && (
              <WinnerComponent
                winner={auction.winner.email}
                amount={auction.currentBid}
              />
            )}

            {/* Bidding History */}
            <h4 className="mb-3">Bidding History</h4>
            <ListGroup className="mb-4">
              {auction.bids.map((bid, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between">
                  <div>
                    <strong>{bid.user?.email}</strong> bid ${bid.amount}
                  </div>
                  <span className="text-muted">
                    {moment(bid.timestamp).format("MMM D, h:mm a")}
                  </span>
                </ListGroup.Item>
              ))}
              {auction.bids.length === 0 && (
                <ListGroup.Item>No bids placed yet</ListGroup.Item>
              )}
            </ListGroup>

            {/* Comment Section */}
            <div className="border-top pt-4">
              <h5 className="mb-3">Comments</h5>
              {comments.length === 10000? (
                <p className="text-muted">No comments yet.</p>
              ) : (
                <ListGroup className="mb-4">
                  {comments.map((comment, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between">
                      <div>
                        <strong>{comment.user?.email}</strong>: {comment.text}
                      </div>
                      <span className="text-muted">
                        {moment(comment.timestamp).format("MMM D, h:mm a")}
                      </span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}

              {/* Add Comment Form */}
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </Form.Group>
              <Button
                onClick={handleAddComment}
                variant="primary"
                className="w-100 py-2"
              >
                Add Comment
              </Button>
            </div>

            {/* Place Bid Form */}
            {auction.status === "active" && (
              <div className="border-top pt-4">
                <h5 className="mb-3">Place a Bid</h5>
                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                <Form.Group className="mb-3">
                  <Form.Control
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    placeholder="Enter bid amount"
                    min={auction.currentBid + 1}
                    step="1"
                    className="py-2"
                  />
                </Form.Group>
                <Button
                  onClick={handlePlaceBid}
                  disabled={loading}
                  variant="success"
                  className="w-100 py-2"
                >
                  {loading ? <Spinner size="sm" /> : "Place Bid"}
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      ) : (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}
    </Container>
  );
};

export default AuctionDetails;
