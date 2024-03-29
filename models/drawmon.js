const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DrawmonSchema = new Schema({
  name: { type: String, required: true, maxLength: 50 },
  description: { type: String },
  population: { type: Number },
  type: [{ type: Schema.Types.ObjectId, ref: 'Type' }],
  special_ability: { type: String, maxLength: 100 },
  image_data: { type: String },
});

DrawmonSchema.virtual('url').get(function () {
  return `/catalog/drawmon/${this._id}`;
});

module.exports = mongoose.model('Drawmon', DrawmonSchema);
