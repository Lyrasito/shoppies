import React from "react";
import gql from "graphql-tag";
import { adopt } from "react-adopt";
import { Query, Mutation } from "react-apollo";
import Nomination from "./Nomination";
import "./Nominations.css";

const LOCAL_STATE_QUERY = gql`
  query {
    nominationsOpen @client
    movies @client {
      Title
      imdbID
    }
  }
`;
const TOGGLE_NOMINATION_MUTATION = gql`
  mutation TOGGLE_NOMINATION_MUTATION {
    toggleNominations @client
  }
`;

const Composed = adopt({
  //  user: ({ render }) => <User>{render}</User>,
  toggleNomination: ({ render }) => (
    <Mutation mutation={TOGGLE_NOMINATION_MUTATION}>{render}</Mutation>
  ),
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
});

class Nominations extends React.Component {
  render() {
    return (
      <Composed>
        {({ localState, toggleNomination }) => (
          <div
            className={
              localState.data.nominationsOpen
                ? "openNominations"
                : "closedNominations"
            }
          >
            <button onClick={toggleNomination} className="nominationsButton">
              {localState.data.nominationsOpen
                ? "Hide Nominations"
                : "Show Nominations"}
            </button>
            {localState.data.nominationsOpen && (
              <div>
                <ol className="nominationList">
                  {localState.data.movies.length ? (
                    localState.data.movies.map((movie) => (
                      <li key={movie.imdbID}>
                        <Nomination movie={movie} />
                      </li>
                    ))
                  ) : (
                    <div className="noNoms">
                      <p>No nominations chosen yet!</p>
                    </div>
                  )}
                </ol>
              </div>
            )}
          </div>
        )}
      </Composed>
    );
  }
}

export default Nominations;
export { LOCAL_STATE_QUERY, TOGGLE_NOMINATION_MUTATION };
