import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import Loader from "../../components/Loader/Loader";
import Message from "../../components/Message/Message";
import { useGetProductDetailsQuery } from "../../slices/productsApiSlice";
import Rating from "../../components/Rating/Rating";
import { addToCart } from "../../slices/cartSlice";

const ProductScreen = () => {
  // get the product id from the URL using the useParams hook
  const { id: productId } = useParams();

  const dispatch = useDispatch(); // dispatch function to dispatch actions to the store
  const navigate = useNavigate(); // navigate function to programmatically navigate to a different route

  const [qty, setQty] = useState(1); // state to manage the quantity of the product

  // fetch the product details using the useGetProductByIdQuery hook
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetProductDetailsQuery(productId);

  const addToCartHandler = () => {
    // dispatch the addToCart action with the product details and quantity
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart"); // navigate to the cart page
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {
        // if the data is loading, display a loading message
        isLoading ? (
          <Loader />
        ) : // if there is an error fetching the data, display an error message
        isError ? (
          <Message variant="danger">
            {error?.data?.message || error?.error}
          </Message>
        ) : (
          // if the product exists, display the product details

          <Row>
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>

            <Col md={4}>
              {/* display the product details in a list group, variant flush removes the borders */}
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {/* if the product is in stock, display a quantity selector, otherwise display "Out of Stock" */}
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {
                          // if the product is in stock, display "In Stock", otherwise display "Out of Stock"
                          product.countInStock > 0 ? "In Stock" : "Out of Stock"
                        }
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Button
                      className="btn-block"
                      type="button"
                      // disable the button if the product is out of stock
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        )
      }
    </>
  );
};

export default ProductScreen;
