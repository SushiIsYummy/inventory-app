const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DrawmonInstanceSchema = new Schema({
  personal_name: { type: String, required: true, maxLength: 50 },
  background_info: { type: String },
  likes: { type: String },
  dislikes: { type: String },
  favourite_foods: { type: String },
  hobbies: { type: String },
  other_info: { type: String },
  drawmon: { type: Schema.Types.ObjectId, ref: 'Drawmon', required: true },
});

DrawmonInstanceSchema.virtual('url').get(function () {
  return `/catalog/drawmoninstance/${this._id}`;
});

module.exports = mongoose.model('DrawmonInstance', DrawmonInstanceSchema);
