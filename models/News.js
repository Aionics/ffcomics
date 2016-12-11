const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsProps = {
    title: String,
    lead: String,
    text: String,
    img: String,
    created_at: {type: Date, default: Date.now}
};

const NewsSchema = new Schema(NewsProps);
const News = mongoose.model('News', NewsSchema);

module.exports = News;
