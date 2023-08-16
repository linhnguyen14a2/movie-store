import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId

let movies;

export default class MoviesDAO {
    static async injectDB(conn) {
        if (movies) {
            return;
        }
        try {
            movies = await  conn.db(
                process.env.MOVIEREVIEWS_COLLECTION).collection('movies');
        } catch (e) {
            console.error(`Unable to connect to moviesDAO: ${e}`);
        }
    }

    static async getMovies({filters = null, page = 0, moviesPerPage = 20,} = {}) {
        let query;
        if (filters) {
            if ('title' in filters) {
                query = {$text: {$search: filters['title']}};
            } else if ('rated' in filters) {
                query = {'rated': {$eq: filters['rated']}};
            }
        }

        let cursor;
        try {
            cursor = await movies.find(query).limit(moviesPerPage).skip(moviesPerPage * page);
            const moviesList = await cursor.toArray();
            const totalNumMovies = await movies.countDocuments(query);
            return {moviesList, totalNumMovies};
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return {moviesList: [], totalNumMovies: 0};
        }
    }

    static async getRatings(){
        let ratings = [];
        try {
            ratings = await movies.distinct('rated');
            return ratings;
        } catch (e) {
            console.error(`Unable to get ratings, ${e}`);
            return ratings;
        }
    }

    static async getMovieById(id) {
        try {
            return await movies.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    }
                },
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'movie_id',
                        as: 'reviews',
                    }
                }
            ]).next();
        } catch (e){
            console.error(`Unable to get movie by ID: ${e}`);
            throw e;
        }
    }

    static async getMultipleMoviesByIdList(ids) {
        try {
            const id_objects = ids.map(id => {
                return new ObjectId(id);
            });

            const query = { _id: { $in: id_objects } };

            let cursor;
            try {
                cursor = await movies.find(query);
                const moviesList = await cursor.toArray();
                const totalNumMovies = await movies.countDocuments(query);
                return {moviesList, totalNumMovies};
            } catch (e) {
                console.error(`unable to issue find command, ${e}`);
                return { moviesList: [], totalNumMovies: 0};
            }

        } catch(e) {
            console.error(`Something went wrong in getMovieById: ${e}`);
            throw e;
        }
    }
}