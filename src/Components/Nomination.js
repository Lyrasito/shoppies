import React from "react";
import gql from "graphql-tag";
import { adopt } from "react-adopt";
import { Query, Mutation, ApolloConsumer } from "react-apollo";
import { ReactComponent as Starred } from "../svg/starfill-svgrepo-com.svg";
import { REMOVE_MOVIE_MUTATION } from "./Movie";
import "./Nomination.css";

const Nomination = (props) => {
  const removeNomination = async (client) => {
    await client.mutate({
      mutation: REMOVE_MOVIE_MUTATION,
      variables: { movie: props.movie },
    });
  };

  return (
    <div className="nomination">
      <p className="nomTitle">{props.movie.Title}</p>

      <ApolloConsumer>
        {(client) => {
          return (
            <button
              className="removeButton"
              onClick={() => removeNomination(client)}
            >
              <Starred width="15" className="removeNomination svg" />
              Remove
            </button>
          );
        }}
      </ApolloConsumer>
    </div>
  );
};

export default Nomination;
