import React, { useState, useEffect, useCallback } from 'react';
import MovieDataService from '../services/movies';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FavoritesContainer from './FavoritesContainer';
import { FavoriteCard } from './FavoriteCard';
import update from 'immutability-helper'

import "./Favorites.css";

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const Favorites = ({
                       user,
                       favorites,
                       updateFavoriteOrder
                   }) => {

    const [favoritesCards, setFavoritesCards] = useState([]);
    const [isTranslated, setisTranslated] = useState(false);

    const initialFavorites = useCallback((favorites) => {
        var data = {
            idlist : favorites
        }

        MovieDataService.getMultipleMovies(data)
            .then(response => {
                let moviesMap = new Map()
                response.data.moviesList.forEach(movie => {
                    let movieObj = {
                        id: movie._id,
                        title: movie.title,
                        poster: movie.poster ? movie.poster : "/images/NoPoster.jpg"
                    }
                    moviesMap.set(movie._id, movieObj)
                })
                const translatedCards = favorites.map((movie_id) => {
                    return moviesMap.get(movie_id)
                })
                setFavoritesCards(translatedCards)
            })
            .catch(e => {
                console.log(e);
            })

        setisTranslated(true)
    }, []);

    useEffect(() => {
        if (favorites) {
            if (favorites.length > 0) {
                if (!isTranslated) {
                    initialFavorites(favorites);
                }
            }
        }
    }, [favorites]);


    return (
        <div>
            <Container className='favoritesContainer'>
                <div className='favoritesPanel'>
                    { favorites.length > 0 ?
                        "Drag your favorites to rank them"
                        :
                        "You don't have any favorites"}
                </div>

                { favoritesCards && favoritesCards.length > 0 && <DndProvider backend={HTML5Backend}>
                    <FavoritesContainer
                        user={user}
                        cards={favoritesCards}
                        updateFavoriteOrder={updateFavoriteOrder}
                    />
                </DndProvider>}
            </Container>
        </div>
    )
}

export default Favorites;