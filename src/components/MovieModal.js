import React from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { useMovieContext } from "../modules/MovieContext";

function MovieModal({ show, handleClose }) {
  const { selectedMovie, poster } = useMovieContext();

  const modalStyle = {
    backgroundColor: "red",
    color: "white",
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body style={modalStyle}>
        <Row>
          <Col xs={12} md={6}>
            <img src={poster} alt={selectedMovie ? selectedMovie.title : ""} style={{ maxWidth: "100%" }} />
          </Col>
          <Col xs={12} md={6}>
            {selectedMovie ? (
              <div>
                <h4>{selectedMovie.title}</h4>
                <p>{selectedMovie.overview}</p>
                <p>Avaliação: {selectedMovie.vote_average}</p>
                <p>Data de lançamento: {selectedMovie.release_date}</p>
                {/* Mais informações do filme */}
              </div>
            ) : (
              "Carregando..."
            )}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default MovieModal;
