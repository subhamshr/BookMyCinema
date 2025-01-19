import { useState, useEffect, useCallback } from "react";

import TableContent from "../../../components/TableContent";
import Paginate from "../../../components/Paginate";

import { Card, CardHeader, Button } from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";

import { dateFormatter } from "../../../utils/date";

import { useDispatch, useSelector } from "react-redux";
import {
  listMovie,
  setCurrentPage,
  setLimit,
} from "../../../slices/movieSlice";

const Movies = () => {
  const dispatch = useDispatch();
  const { movies, limit, currentPage, total } = useSelector(
    (state) => state.movies
  );
  const [filteredMovies, setFilteredMovies] = useState([]);

  const getHeaders = (data) => {
    if (data?.length === 0) return [];
    const {
      slug,
      synopsis,
      poster,
      createdAt,
      id,
      products,
      updatedAt,
      __v,
      _id,
      ...rest
    } = data[0];
    return Object.keys(rest);
  };

  const initialFetch = useCallback(() => {
    dispatch(listMovie({ page: currentPage, limit, title: "" }));
  }, [dispatch, currentPage, limit]);

  const updateLimit = (number) => {
    dispatch(setLimit(number));
  };

  const updateCurrentPage = (number) => {
    dispatch(setCurrentPage(number));
  };

  useEffect(() => {
    initialFetch();
  }, [initialFetch]);

  useEffect(() => {
    const data = [];
    movies.map((item) => {
      const { releaseDate, endDate, ...rest } = item;
      rest.releaseDate = dateFormatter(releaseDate);
      rest.endDate = dateFormatter(endDate);
      data.push(rest);
    });
    setFilteredMovies(data);
  }, [movies]);

  return (
    <>
      <Card>
        <CardHeader className="fs-1">
          Movies
          <div className="d-flex justify-content-end">
            <Button className="d-flex justify-content-between align-items-center">
              <span>Create New Movie</span>
              <IoMdAdd />
            </Button>
          </div>
        </CardHeader>

        <Card.Body>
          {filteredMovies.length > 0 && (
            <>
              <TableContent
                headers={getHeaders(movies)}
                data={filteredMovies}
                edit="/admin/movies"
                remove="/admin/movie"
              />
              <Paginate
                total={total}
                limit={limit}
                currentPage={currentPage}
                setCurrentPage={updateCurrentPage}
                setLimit={updateLimit}
              />
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default Movies;
