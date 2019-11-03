const express = require('express');
const router = express.Router();
const movieService = require('./movie.service');

function fetchUpcomingMovies(req, res, next) {
    movieService.findUpcomingMovies()
        .then(movies => res.json(movies))
        .catch(err => next(err));
}

function findMovies(req, res, next) {
    movieService.findMovies(req.params.keyword)
        .then(movies => res.json(movies))
        .catch(err => next(err));
}

function fetchRecentMovies(req, res, next) {
    movieService.findRecentMovies()
        .then(movies => res.json(movies))
        .catch(err => next(err));
}

function bookmarkMovie(req, res, next) {
    movieService.bookmarkMovie(req.body)
        .then(res.status(200).json({ message: 'Movie bookmarked successfully.' }))
        .catch(err => next(err));
}

function getBookmarkMovie(req, res, next) {
    movieService.getBookmarkMovies()
        .then(movies => res.json(movies))
        .catch(err => next(err));
}
// Posts routes
router.get('/upcoming/movies', fetchUpcomingMovies);
router.get('/:keyword', findMovies);
router.get('/', fetchRecentMovies);
router.post('/bookmark', bookmarkMovie);
router.get('/bookmark/movies', getBookmarkMovie);

module.exports = router;
