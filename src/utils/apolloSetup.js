import { ApolloClient } from "apollo-boost";
import { RestLink } from "apollo-link-rest";
import { InMemoryCache } from "apollo-cache-inmemory";
import dotenv from "dotenv";
import { LOCAL_STATE_QUERY } from "../Components/Nominations";
dotenv.config();

const restLink = new RestLink({
  uri: `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_KEY}&type=movie`,
});

// setup your client
const client = new ApolloClient({
  link: restLink,
  cache: new InMemoryCache({}),

  resolvers: {
    //{cache} is destructured from client
    Mutation: {
      toggleNominations(_, variables, { cache }) {
        //read the cart state from the cache
        const { nominationsOpen } = client.readQuery({
          query: LOCAL_STATE_QUERY,
        });

        const data = {
          data: {
            nominationsOpen: !nominationsOpen,
          },
        };
        client.writeData(data);
        return data;
      },
      addMovie(_, variables, { cache }) {
        const { movies } = client.readQuery({
          query: LOCAL_STATE_QUERY,
        });
        if (movies.length < 5) movies.push(variables.movie);

        const data = {
          data: {
            movies,
          },
        };
        client.writeData(data);
        return null;
      },
      removeMovie(_, variables, { cache }) {
        const { movies } = client.readQuery({
          query: LOCAL_STATE_QUERY,
        });
        //console.log(variables.movie);
        const movieToRemove = variables.movie;
        //console.log(movieToRemove);
        const newMovies = movies.filter(
          (movie) => movie.imdbID !== movieToRemove.imdbID
        );

        client.writeData({
          data: {
            movies: newMovies,
          },
        });
        return newMovies;
      },
    },
  },
});
function initLocalCache() {
  client.cache.writeData({
    data: {
      nominationsOpen: false,
      movies: [],
    },
  });
}
initLocalCache();
export default client;
