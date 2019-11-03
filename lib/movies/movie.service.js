const request = require("request");
const db = require('../shared/dataSource');
const Movie = db.Movie;

const config = require('config');
MOVIE_HOST = config.get('MOVIE_HOST');
APIKEY = config.get('API_KEY');

function loadMovies(options) {
    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) {
                error.response = response;
                reject(error);
                return;
            }

            console.log(response)

            if (response.statusCode < 200 || response.statusCode > 299) {
                const notOkError = new Error('Response status code was not a success code in the 200 range.');
                notOkError.response = response;
                reject(notOkError);
                return;
            }

            resolve(JSON.parse(response.body));
        });
    });
}


function MoviewModel(movie) {
    const model = {
        poster_path: `http://image.tmdb.org/t/p/w185/${movie.poster_path}`,
        id: movie.id,
        title: movie.title,
        vote_average: movie.vote_average,
        overview: movie.overview,
        release_date: movie.release_date,
        vote_count: movie.vote_count,
        bookmarked: false
    }

    return model;
}

async function findUpcomingMovies() {
    let options = {
        method: "GET",
        url: `${MOVIE_HOST}/3/movie/upcoming?language=en-US&region=US&api_key=${APIKEY}`,
        headers: {}
    };

    const movies = await loadMovies(options);
    const movieResults = movies.results;
    const movieModels = movieResults.map(movie => new MoviewModel(movie))

    return movieModels;
}

async function findMovies(keyword) {
    let options = {
        method: "GET",
        url: `${MOVIE_HOST}/3/search/movie?api_key=${APIKEY}&query=${keyword}`,
        headers: {}
    };

    const movies = await loadMovies(options);
    const movieResults = movies.results;
    const movieModels = movieResults.map(movie => new MoviewModel(movie))

    return movieModels;
}

async function findRecentMovies() {
    let options = {
        method: "GET",
        url: `${MOVIE_HOST}/3/discover/movie?primary_release_date.gte=2019-10-10&primary_release_date.lte=2019-11-10&api_key=${APIKEY}`,
        headers: {}
    };

    const movies = await loadMovies(options);
    const movieResults = movies.results;
    const movieModels = movieResults.map(movie => new MoviewModel(movie))

    return movieModels;
}

async function bookmarkMovie(movieParams) {
    movieParams.bookmarked = true;
    const movie = new Movie(movieParams);
    await movie.save();
}

async function getBookmarkMovies() {
    const res = await Movie.find();
    return res;
}


module.exports = {
    findRecentMovies,
    findMovies,
    findUpcomingMovies,
    bookmarkMovie,
    getBookmarkMovies
};
