import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";


import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";

import styles from "./App.module.css";

function App() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: !!query,
    retry: false,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error("No movies found");
    }
  }, [data]);

  return (
    <div className={styles.wrapper}>
      <Toaster />
      <SearchBar onSubmit={setQuery} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && (
        <>
         
         {data.total_pages > 1 && (
              <>
      <ReactPaginate
        pageCount={data.total_pages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => setCurrentPage(selected + 1)}
        forcePage={currentPage - 1}
        containerClassName={styles.pagination}
        activeClassName={styles.active}
        nextLabel="→"
        previousLabel="←"
      />
       </>
    )}
          <MovieGrid movies={data.results} onMovieClick={setSelectedMovie} />
        
        </>
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}

export default App;
