import {Routes, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import {Navbar, Nav} from "react-bootstrap";

import  MoviesList from "./components/MoviesList";
import Movie from "./components/Movie";
import './App.css';
import {useState, useEffect, useCallback} from 'react';
import {GoogleOAuthProvider} from "@react-oauth/google";
import Login from "./components/Login";
import Logout from "./components/Logout";
import AddReview from "./components/AddReview";
import Favorites from "./components/Favorites";
import MovieDataService from "./services/movies";
import { gapi } from "gapi-script"

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
function App() {

  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (movieId) => {
    setFavorites([...favorites, movieId]);
  }

  const deleteFavorite = (movieId) => {
    setFavorites(favorites.filter(f => f!== movieId));
  }

  const getAllFavorites = useCallback((user_id) => {
    MovieDataService.getFavorite(user_id)
        .then(response => {
          setFavorites(response.data.favorites);
        })
        .catch(e => {
          setFavorites([]);
          console.log(e);
        });
  });

  const updateAllFavorites = useCallback((user_id, favorites) => {
    let data = {
      _id: user_id,
      favorites: favorites,
    }
    MovieDataService.updateFavorite(data)
        .catch(e => {
          console.log(e);
        });
  }, []);

  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId: clientId,
      scope: 'profile email',
      plugin_name: "sample-login",
    });
  });

  useEffect(() => {
    let loginData = JSON.parse(localStorage.getItem("login"));
    if(loginData){
      let loginExp = loginData.exp;
      let now = Date.now()/1000;
      if (now < loginExp) {
        setUser(loginData);
      } else {
        localStorage.setItem("login", null);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      getAllFavorites(user.googleId);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      updateAllFavorites(user.googleId, favorites);
    }
  }, [favorites]);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="App">
      <Navbar bg="primary" expand="lg" sticky="top" variant="dark">
        <Container className="container-fluid">
          <Navbar.Brand className="brand" href="/">
            <img src="/images/movies-logo.png" alt="movies logo" className="moviesLogo"/>
            MOVIE TIME
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav'/>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link as={Link} to="/movies">
                Movies
              </Nav.Link>
              {user && <Nav.Link as={Link}  to="/favorites">
                Favorites
              </Nav.Link>}
            </Nav>
          </Navbar.Collapse>
          { user ? (
              <Logout setUser={setUser} />
          ) : (
              <Login setUser={setUser}/>
          )}
        </Container>
      </Navbar>

      <Routes>
        <Route exact path="/" element={
          <MoviesList user={ user }
                      addFavorite={ addFavorite }
                      deleteFavorite={deleteFavorite}
                      favorites={ favorites }
          />}
        />
        <Route exact path="/movies" element={
          <MoviesList
              user={ user }
              addFavorite={ addFavorite }
              deleteFavorite={deleteFavorite}
              favorites={ favorites }
          />}
        />
        <Route exact path="/movies/:id" element={
          <Movie user={ user }/>}
        />
        <Route exact path="/movies/:id/review" element={
          <AddReview user={ user }/>}
        />
        <Route exact path="/favorites" element={
          user
              ?
              <Favorites user={ user }
                         favorites={ favorites }
                         updateFavoriteOrder = { setFavorites }
              />
              :
              <MoviesList
                  user ={ user }
                  addFavorite={ addFavorite }
                  deleteFavorite={ deleteFavorite }
                  favorites={ favorites }
              />
        }
        />
      </Routes>
    </div>
    </GoogleOAuthProvider>
  );
}

export default App;
