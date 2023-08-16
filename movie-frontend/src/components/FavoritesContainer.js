import React, { useState, useEffect, useCallback } from 'react';
import MovieDataService from '../services/movies';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { FavoriteCard } from './FavoriteCard';
import update from 'immutability-helper'

import "./Favorites.css";


const FavoritesContainer = ({
                                user,
                                cards,
                                updateFavoriteOrder
                            }) => {

    const [favoritesCards, setFavoritesCards] = useState(cards);
    const [initialized, setIntialized] = useState(false);

    const moveCard = useCallback((dragIndex, hoverIndex) => {
        setFavoritesCards((prevCards) =>
            update(prevCards, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevCards[dragIndex]],
                ],
            }),
        )
    }, [])

    const renderCard = useCallback((card, index) => {
        return (
            <FavoriteCard
                key={index}
                index={index}
                id={card.id}
                title={card.title}
                poster={card.poster}
                moveCard={moveCard}
            />
        )
    }, [favoritesCards])

    useEffect(() => {
        if (!initialized) {
            if (favoritesCards && favoritesCards.length > 0) {
                setIntialized(true);
            }
        } else if (initialized) {
            let movieIds = favoritesCards.map(card => {
                return card.id;
            })

            updateFavoriteOrder(movieIds)
        }
    }, [favoritesCards]);

    return (

        <div style={{width:"500px", margin:"1em"}}>
            {favoritesCards && favoritesCards.map((card, i) => renderCard(card, i))}
            {/* <Row>
                <Col>
                        {favoritesCards && favoritesCards.map((card, i) => renderCard(card, i))}
                </Col>
            </Row> */}
        </div>

    )
}

export default FavoritesContainer;