import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";
import api from "../../services/api";
import SearchInput from "../../components/SearchInput";
import MovieModal from "../../components/MovieModal";
import MovieCard from "../../components/MovieCard";

function Home() {
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emptyInput, setEmptyInput] = useState(false);
  const [count, setCount] = useState(0);

  const filterData = (query, data) => {
    if (emptyInput) {
      setEmptyInput(false);
    }

    if (!query) {
      return data;
    } else {
      const filtered = data.filter((movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      );

      if (filtered.length === 0) {
        const searchMovies = async () => {
          try {
            setLoading(true);
            const response = await api.get("/search/movie", {
              params: {
                query,
                page,
              },
            });

            setMovies(response.data.results);
            setCount(response.data.total_results);
          } catch (error) {
            console.error("Erro na solicitação à API: ", error);
          } finally {
            setLoading(false);
          }
        };

        searchMovies(query);
        return [];
      } else {
        return filtered;
      }
    }
  };

  const onTapSearch = () => {
    if (searchQuery.trim().length < 1) {
      setEmptyInput(true);
    } else {
      filterData(searchQuery, movies);
    }
  };

  const dataFiltered = useMemo(() => filterData(searchQuery, movies), [
    searchQuery,
    movies,
  ]);

  const fetchMovies = async (page) => {
    try {
      setLoading(true);
      const response = await api.get("/discover/movie", {
        params: {
          page,
        },
      });
      setMovies(response.data.results);
      setCount(response.data.total_results);
    } catch (error) {
      console.error("Erro na solicitação à API: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  const openModal = async (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);

    if (movie.poster_path) {
      const posterResponse = await api.get(`/movie/${movie.id}/images`);
      if (posterResponse.data.posters && posterResponse.data.posters.length > 0) {
        const posterPath = posterResponse.data.posters[0].file_path;
        setPoster(`https://image.tmdb.org/t/p/original${posterPath}`);
      }
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setShowModal(false);
    setPoster(null);
  };

  return (
    <Container>
      <SearchInput
        placeholder="Busque seu filme"
        value={searchQuery}
        onChange={setSearchQuery}
        onTapSearch={onTapSearch}
        emptyInput={emptyInput}
      />
      <Row>
        {dataFiltered.map((movie) => (
          <Col key={movie.id} lg={3} md={4} sm={6} xs={12}>
            <MovieCard movie={movie} openModal={openModal} />
          </Col>
        ))}
      </Row>

      <Pagination
        count={Math.ceil(count / 20)}
        page={page}
        onChange={(event, value) => setPage(value)}
      />

      <MovieModal show={showModal} handleClose={closeModal} movie={selectedMovie} poster={poster} />
    </Container>
  );
}

export default Home;
