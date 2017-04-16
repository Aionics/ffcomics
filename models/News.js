const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsProps = {
    title: String,
    lead: String,
    items: [{
        name: String,
        promoted: Boolean,
        data: {}
    }],
    created_at: {type: Date, default: Date.now}
};

const NewsSchema = new Schema(NewsProps);
const News = mongoose.model('News', NewsSchema);

module.exports = News;
