const movieModel = require("./movie.model");
const { slugger } = require("../../utils/text");
const moment = require("moment");

const create = async (payload) => {
  // create slug from title eg : The Invincibles slug->the-invincibles {use slugify package in /utils}
  const slugTitle = slugger(payload.title);
  // check if slug exists in database
  const movie = await movieModel.findOne({ slug: slugTitle });
  if (movie) throw new Error("Movie title already exists");
  payload.slug = slugTitle;
  // create movie
  return await movieModel.create(payload);
};

const list = async ({ page = 1, limit = 10, search }) => {
  const query = [];
  // Search
  if (search?.title) {
    query.push({
      $match: {
        title: new RegExp(search?.title, "gi"),
      },
    });
  }
  // Sort
  query.push({
    $sort: {
      createdAt: 1,
    },
  });
  // Pagination
  query.push(
    {
      $facet: {
        metadata: [
          {
            $count: "total",
          },
        ],
        data: [
          {
            $skip: (+page - 1) * +limit,
          },
          {
            $limit: +limit,
          },
        ],
      },
    },
    {
      $addFields: {
        total: {
          $arrayElemAt: ["$metadata.total", 0],
        },
      },
    },
    {
      $project: {
        metadata: 0,
        "data.createdBy": 0,
      },
    }
  );
  const result = await movieModel.aggregate(query);
  return {
    total: result[0]?.total || 0,
    movies: result[0]?.data,
    page: +page,
    limit: +limit,
  };
};

const getBySlug = async (slug) => {
  return await movieModel.findOne({ slug });
};

const update = async (slug, payload) => {
  if (payload.title) {
    payload.slug = slugger(payload?.title);
  }
  return await movieModel.findOneAndUpdate({ slug }, payload, { new: true });
};

const updateReleaseDate = async (slug, payload) => {
  // TODO check if releaseDate is older than today {use moment, luxon, date-fns}
  const result = await movieModel.findOneAndUpdate({ slug }, payload, {
    new: true,
  });
  return result;
};

const updateSeats = async (slug, payload) => {
  const movie = await movieModel.findOne({ slug });
  if (!movie) throw new Error("Movie doesnt exist");
  if (payload.seats < process.env.MIN_SEATS)
    throw new Error(`Movie seats cant be less than ${process.env.MIN_SEATS}`);
  return await movieModel.findOneAndUpdate({ slug }, payload, { new: true });
};

const remove = async (slug) => {
  const movie = await movieModel.findOne({ slug });
  if (!movie) throw new Error("Movie doesnt exist");
  // TODO movie's ticket must not have been sold

  // the movie should not be ongoing (should not be in between relase and end dates)
  if (
    moment(movie?.releaseDate).isBefore(moment()) &&
    moment(movie?.endDate).isAfter(moment())
  ) {
    throw new Error(
      "Cannot delete movie since movie is currently in releasing phase"
    );
  }
  return await movieModel.deleteOne({ slug });
};

module.exports = {
  create,
  list,
  getBySlug,
  update,
  updateReleaseDate,
  updateSeats,
  remove,
};
