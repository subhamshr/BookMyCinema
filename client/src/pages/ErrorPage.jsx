import { Container, Row, Col ,Button} from "react-bootstrap";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <>
      <Container className="mt-5">
        <Row>
          <Col md={{ span: 6, offset: 3 }} className="text-center">
            <h1>404 - Not Found</h1>
            <p>
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>
            <Link to="/">
              <Button variant="primary">Go Home</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
};

// TODO error page beautify remaining

export default ErrorPage;
