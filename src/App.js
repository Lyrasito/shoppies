import { Query } from "react-apollo";
import Search from "./Components/Search";
import Nominations from "./Components/Nominations";
import { LOCAL_STATE_QUERY } from "./Components/Nominations";
import "./App.css";
import Banner from "./Components/Banner";
import backgroundImg from "./img/pexels-adrien-olichon-3709370.jpg";

const App = () => {
  return (
    <div>
      <Query query={LOCAL_STATE_QUERY}>
        {({ data }) =>
          data.movies.length === 5 && (
            <div id="banner">
              <Banner />
            </div>
          )
        }
      </Query>

      <div
        className="header"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <div className="nominations">
          <Nominations />
        </div>

        <div className="intro">
          <h1 className="title">The Shoppies</h1>
          <div className="description">
            <p>
              Search our movie database and choose five of your favourite movies
              that YOU think should receive Oscar nominations!
            </p>
          </div>
        </div>
      </div>
      <Search />
    </div>
  );
};

export default App;
