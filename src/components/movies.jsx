import React, { Component } from "react";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import { getMovies } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";
import { paginate } from "../utils/paginate";
import MoviesTable from "./moviesTable";

class Movies extends Component {
  state = {
    // movies: getMovies(),
    // genres: getGenres(),
    movies: [],
    genres: [],
    currentPage: 1,
    pageSize: 4
    // selectedGenre: null
  };

  componentDidMount() {
    const genres = [{ name: "All Genres" }, ...getGenres()];
    this.setState({ movies: getMovies(), genres: genres });
  }

  handleDelete = movie => {
    const movies = this.state.movies.filter(m => m._id !== movie._id);
    this.setState({ movies: movies });
    // use setState to modify the state
    // first one the old one and second one the new one
    // if the new one and the one we wnat to replace the old one with have the same name, we can just use it and write onece
  };

  handleLike = movie => {
    // console.log(movie);
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, currentPage: 1 });
    // console.log("this.state.selectedGenre", this.state.selectedGenre);
  };

  render() {
    const { length: count } = this.state.movies;
    const { pageSize, currentPage, selectedGenre, movies: allMovies } = this.state;
    if (count === 0) return <p>There are no movies in the database.</p>;

    // take the correct movies
    const filtered = selectedGenre && selectedGenre._id ? allMovies.filter(m => m.genre._id === selectedGenre._id) : allMovies;
    const movies = paginate(filtered, currentPage, pageSize);

    // console.log(movies);
    // in jsx, render only return a single element
    // if we want to return multiple elements, they should have a parent
    return (
      <div className="row">
        {/* <div className="col-3"> */}
        <div className="col-3">

          <ListGroup
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            // textProperty="name"
            // valueProperty="_id"
            onItemSelect={this.handleGenreSelect}
          />
        </div>

        <div className="col">
          <p>Showing {filtered.length} movies in the database.</p>
          <MoviesTable movies={movies} onLike={this.handleLike} onDelete={this.handleDelete} />
          <Pagination
            itemsCount={filtered.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
