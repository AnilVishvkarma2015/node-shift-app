const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    poster_path: { type: String },
    id: { type: Number },
    title: { type: String },
    vote_average: { type: Number },
    overview: { type: String },
    release_date: { type: String },
    vote_count: { type: Number },
    bookmarked: { type: Boolean },
    userId: { type: String },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Movie', schema);
