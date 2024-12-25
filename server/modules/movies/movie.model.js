const { Schema, model } = require("mongoose");

const { ObjectId } = Schema.Types;

const movieSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true },
    duration: { type: String, required: true },
    synopsis: { type: String },
    poster: { type: String, required: true },
    releaseDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, required: true },
    rating: { type: Number, default: 0 },
    seats: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    createdBy: { type: ObjectId, ref: "User" },
    updatedBy: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Movie", movieSchema);



