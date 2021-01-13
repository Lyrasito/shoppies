import React from "react";
import gql from "graphql-tag";
import { ApolloConsumer, Query } from "react-apollo";
import { ReactComponent as UnStarred } from "../svg/star-svgrepo-com.svg";
import { ReactComponent as Starred } from "../svg/starfill-svgrepo-com.svg";
import "./Movie.css";
import { LOCAL_STATE_QUERY } from "./Nominations";
import client from "../utils/apolloSetup";

const ADD_MOVIE_MUTATION = gql`
  mutation ADD_MOVIE_MUTATION($movie: Object!) {
    addMovie(movie: $movie) @client(type: Object) {
      movie {
        Title
        __typename
        imdbID
        movie
      }
    }
  }
`;
const REMOVE_MOVIE_MUTATION = gql`
  mutation REMOVE_MOVIE_MUTATION($movie: Object!) {
    removeMovie(movie: $movie) @client(type: Object) {
      movie {
        Title
        __typename
        imdbID
        movie
      }
    }
  }
`;

class Movie extends React.Component {
  state = {
    starred: false,
  };

  componentDidMount() {
    const { movies } = client.readQuery({
      query: LOCAL_STATE_QUERY,
    });
    for (let i = 0; i < movies.length; i++) {
      if (movies[i].imdbID === this.props.movie.imdbID) {
        this.setState({ starred: true });
      }
    }
  }

  addNomination = async (client) => {
    await client.mutate({
      mutation: ADD_MOVIE_MUTATION,
      variables: { movie: this.props.movie },
    });
    this.setState({ starred: true });
  };
  removeNomination = async (client) => {
    await client.mutate({
      mutation: REMOVE_MOVIE_MUTATION,
      variables: { movie: this.props.movie },
    });
    this.setState({ starred: false });
  };

  render() {
    const { movie } = this.props;
    return (
      <div className="movieContainer">
        <img src={movie.Poster} alt={movie.title} width="150" />
        <div className="movieInfo">
          <h2>Title: {movie.Title}</h2>
          <h3>Year: {movie.Year}</h3>

          <ApolloConsumer>
            {(client) => {
              return this.state.starred ? (
                <button onClick={() => this.removeNomination(client)}>
                  <Starred width="30" className="removeNomination svg" />
                  Remove from nominations!
                </button>
              ) : (
                <button onClick={() => this.addNomination(client)}>
                  <UnStarred width="30" className="addNomination svg" />
                  Add to nominations!
                </button>
              );
            }}
          </ApolloConsumer>
        </div>
      </div>
    );
  }
}

export default Movie;
export { REMOVE_MOVIE_MUTATION };
