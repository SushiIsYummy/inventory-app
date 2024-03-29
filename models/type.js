const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TypeSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String },
  image_data: { type: String },
});

TypeSchema.virtual('url').get(function () {
  return `/catalog/type/${this._id}`;
});

module.exports = mongoose.model('Type', TypeSchema);
