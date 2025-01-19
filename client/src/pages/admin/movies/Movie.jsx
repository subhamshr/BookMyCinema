import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Container, Row, Col, Form, Button } from "react-bootstrap";

import { dateFormatter } from "../../../utils/date";
import { useSelector, useDispatch } from "react-redux";
import {
  getOneMovie,
  updateMovie,
  changeMovieSeats,
  updateReleaseDate,
} from "../../../slices/movieSlice";

const Movie = () => {
  const dispatch = useDispatch();
  const { movie } = useSelector((state) => state.movies);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const movieSlug = pathname.split("/")[3];

  const [payload, setPayload] = useState({
    title: movie?.title || "",
    duration: movie?.duration || "",
    price: movie?.price || "",
    rating: movie?.rating || "",
    synopsis: movie?.synopsis || "",
  });

  const handleEdit = async (e) => {
    e.preventDefault();
    dispatch(updateMovie({ slug: movieSlug, payload }));
    navigate("/admin/movies");
  };

  useEffect(() => {
    dispatch(getOneMovie(movieSlug));
  }, [dispatch, movieSlug]);

  useEffect(() => {
    setPayload({
      title: movie?.title || "",
      duration: movie?.duration || "",
      price: movie?.price || "",
      rating: movie?.rating || "",
      synopsis: movie?.synopsis || "",
    });
  }, [movie]);

  return (
    <>
      <Container className="mt-5">
        <h1 className="pb-4">Edit Movie</h1>
        <Row>
          <Col md={12} className="movie-md-1">
            <h4 className="mb-3">Movie Information</h4>
            <Form className="needs-validation" onSubmit={handleEdit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label htmlFor="title">Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={payload?.title}
                    onChange={(e) =>
                      setPayload((prev) => {
                        return { ...prev, title: e.target.value };
                      })
                    }
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Valid title is required.
                  </Form.Control.Feedback>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label htmlFor="duration">Duration</Form.Label>
                  <Form.Control
                    type="text"
                    value={payload?.duration}
                    onChange={(e) =>
                      setPayload((prev) => {
                        return { ...prev, duration: e.target.value };
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid duration.
                  </Form.Control.Feedback>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label htmlFor="title">Price</Form.Label>
                  <Form.Control
                    type="text"
                    value={payload?.price}
                    onChange={(e) =>
                      setPayload((prev) => {
                        return { ...prev, price: e.target.value };
                      })
                    }
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Valid price is required.
                  </Form.Control.Feedback>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label htmlFor="rating">Rating</Form.Label>
                  <Form.Control
                    type="number"
                    max={10}
                    min={1}
                    step={0.1}
                    value={payload?.rating}
                    onChange={(e) =>
                      setPayload((prev) => {
                        return { ...prev, rating: e.target.value };
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid rating.
                  </Form.Control.Feedback>
                </Col>
              </Row>
              <hr className="mb-4" />

              <Row>
                <Col md={10}>
                  <Form.Group>
                    <Form.Label htmlFor="synopsis">Synopsis</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={8}
                      value={payload?.synopsis}
                      onChange={(e) =>
                        setPayload((prev) => {
                          return { ...prev, synopsis: e.target.value };
                        })
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      Valid synopsis is required.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <hr className="mb-4" />

              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label htmlFor="seats">Seats</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter seats"
                      defaultValue={movie?.seats}
                      onChange={(e) =>
                        setTimeout(() => {
                          dispatch(
                            changeMovieSeats({
                              slug: movieSlug,
                              payload: { seats: e.target.value },
                            })
                          );
                        }, 1000)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label htmlFor="releaseDate">
                      Current Release Date : {dateFormatter(movie?.releaseDate)}
                    </Form.Label>
                    <Form.Control
                      type="datetime-local"
                      onChange={(e) =>
                        setTimeout(() => {
                          dispatch(
                            updateReleaseDate({
                              slug: movieSlug,
                              payload: { releaseDate: e.target.value },
                            })
                          );
                        }, 1000)
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button
                className="mt-4"
                variant="primary"
                size="lg"
                type="submit"
              >
                Save
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Movie;
