import React from "react";
import { ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import "./Search.css";
import SearchResults from "./SearchResults";
import Nominations from "./Nominations";

const GET_MOVIES_QUERY = gql`
  query GET_MOVIES_QUERY($title: String!) {
    movie(title: $title) @rest(type: "Movies", path: "&s={args.title}") {
      totalResults
      Search
      Error
    }
  }
`;

class Search extends React.Component {
  state = {
    title: "",
    searchedTitle: "",
    pages: null,
    error: null,
  };
  onChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };
  searchMovies = async (event, client) => {
    this.setState({ error: null });
    const res = await client.query({
      query: GET_MOVIES_QUERY,
      variables: { title: this.state.title },
    });
    console.log(res.data);
    if (res.data.movie.Error === "Too many results.") {
      this.setState({
        error:
          "Your search returned too many results - please be more specific.",
      });
    }
    this.setState({
      pages: Math.ceil(res.data.movie.totalResults / 10),
      searchedTitle: this.state.title,
    });
  };

  render() {
    return (
      <div>
        <div className="searchContainer">
          <h2>Search movies by title:</h2>
          <input
            type="text"
            name="title"
            className="searchBar"
            value={this.state.title}
            onChange={this.onChange}
          ></input>

          <ApolloConsumer>
            {(client) => {
              return (
                <button
                  className="searchButton"
                  onClick={(event) => {
                    this.searchMovies(event, client);
                  }}
                >
                  Search
                </button>
              );
            }}
          </ApolloConsumer>
        </div>

        <div className="searchResults">
          {this.state.pages > 0 && (
            <SearchResults
              pages={this.state.pages}
              title={this.state.searchedTitle}
            />
          )}
          {this.state.pages === 0 && !this.state.error && (
            <h1>Sorry, your search returned no results!</h1>
          )}
          {this.state.error && <h1>{this.state.error}</h1>}
        </div>
      </div>
    );
  }
}

export default Search;
export { GET_MOVIES_QUERY };
