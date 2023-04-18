import { useState } from "react";
import ParentComponent from "./Components/ParentComponent";
import { DragDropContext } from "react-beautiful-dnd";
import { Container, Row, Col } from "react-bootstrap";
import "./App.css";
function App() {
  const [state, setState] = useState();

  return (
    <div className="App">
      <Container>
        <Row className="align-items-center">
          <Col xs="auto">
            <h1>
              Welcome to Cat Mania{" "}
              <span className="">
                <img
                  src="./happy.png"
                  alt=""
                  className="img-fluid"
                  height={40}
                  width={40}
                />
              </span>
            </h1>
          </Col>
          <Col>
            <ParentComponent />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
