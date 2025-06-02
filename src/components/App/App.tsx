import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginate from "react-paginate";
import toast, { Toaster } from "react-hot-toast";

import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";

import styles from "./App.module.css";

export default function App() {
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");

    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ['movies', query, page],
        queryFn: () => fetchMovies(query, page),
        enabled: query !== '',
        placeholderData: keepPreviousData,
    });
    
    const handleSearch = (query: string) => {
    setPage(1);
        setQuery(query);
};
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    
    const handleSelectMovie = (movie: Movie) => setSelectedMovie(movie);

    const closeModal = () => setSelectedMovie(null);

     useEffect(() => {
    if (isSuccess && data.results.length == 0) {
      toast.error("No movies found for your request.");
    }
     }, [data, isSuccess]);
    
    const totalPages = data?.total_pages ?? 0;

    const results = data?.results ?? [];


    return (
        <div className={styles.app}>
           <Toaster position="top-center" reverseOrder={false} />
            <SearchBar onSubmit={handleSearch} />

            {isSuccess && totalPages > 1 && (
                <ReactPaginate
                    pageCount={totalPages}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={1}
                    onPageChange={({ selected }) => setPage(selected + 1)}
                    forcePage={page - 1}
                    containerClassName={styles.pagination}
                    activeClassName={styles.active}
                    nextLabel="→"
                    previousLabel="←"
                />
            )}

            {isLoading && <Loader />}
            {isError && <ErrorMessage />}

            {results.length > 0 && (
                <MovieGrid movies={results} onSelect={handleSelectMovie} />
            )}
      {selectedMovie !== null && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
        </div>
    )
}