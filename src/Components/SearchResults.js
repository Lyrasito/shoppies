import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./SearchResults.css";
import Movie from "./Movie";

const GET_MOVIES_QUERY = gql`
  query GET_MOVIES_QUERY($title: String!, $page: Int!) {
    movies(title: $title, page: $page)
      @rest(type: "Movies", path: "&s={args.title}&page={args.page}") {
      Search @type(name: "Movie") {
        Title
        imdbID
        Poster
        Year
        Rated
        Released
      }
      totalResults
    }
  }
`;

class SearchResults extends React.Component {
  state = {
    page: 1,
  };

  pageBack = () => {
    if (this.state.page > 1) {
      this.setState({ page: this.state.page - 1 });
    }
  };

  pageForward = () => {
    if (this.state.page < this.props.pages) {
      this.setState({ page: this.state.page + 1 });
    }
  };

  keyDown = (e) => {
    if (e.key === "Enter") {
      this.setState({ page: e.target.value });
    }
  };
  render() {
    return (
      <div className="searchResultsContainer">
        <div className="pageNav">
          <p>
            {" "}
            <span
              onClick={this.pageBack}
              className={
                this.state.page <= 1 ? "disabled navButton" : "navButton"
              }
            >
              {" "}
              &lt;&lt;{" "}
            </span>{" "}
            Page {this.state.page} of {this.props.pages}{" "}
            <span
              onClick={this.pageForward}
              className={
                this.state.page >= this.props.pages
                  ? "disabled navButton"
                  : "navButton"
              }
            >
              {" "}
              &gt;&gt;{" "}
            </span>
          </p>
          <label htmlFor="pageNav">
            Go to page:
            <input type="number" name="pageNav" onKeyDown={this.keyDown} />
          </label>
        </div>
        <div className="moviesContainer">
          <Query
            query={GET_MOVIES_QUERY}
            variables={{ title: this.props.title, page: this.state.page }}
          >
            {({ data, loading }) => {
              if (loading) return <p>Loading...</p>;
              return data.movies.Search.map((movie) => {
                return <Movie movie={movie} key={movie.imdbID} />;
              });
            }}
          </Query>
        </div>
        <div className="pageNav">
          <p>
            {" "}
            <span
              onClick={this.pageBack}
              className={
                this.state.page <= 1 ? "disabled navButton" : "navButton"
              }
            >
              {" "}
              &lt;&lt;{" "}
            </span>{" "}
            Page {this.state.page} of {this.props.pages}{" "}
            <span
              onClick={this.pageForward}
              className={
                this.state.page >= this.props.pages
                  ? "disabled navButton"
                  : "navButton"
              }
            >
              {" "}
              &gt;&gt;{" "}
            </span>
          </p>
          <label htmlFor="pageNav">
            Go to page:
            <input type="number" name="pageNav" onKeyDown={this.keyDown} />
          </label>
        </div>
      </div>
    );
  }
}

export default SearchResults;
