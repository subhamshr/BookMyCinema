const orderModel = require("./order.model");
const movieModel = require("../movies/movie.model");
const { v4: uuidv4 } = require("uuid");

const event = require("events");
const { sendMail } = require("../../services/email");

const myEvent = new event.EventEmitter();

myEvent.addListener("sendOrderDetails", (email, order) => {
  const productsList = order.products
    .map(
      (product) => `
    <li>
      <p>Product Id: ${product._id}</p>
      <p>Product Price: $${product.price}</p>
      <p>Quantity: ${product.quantity}</p>
      <p>Quantity: $${product.amount}</p>
    </li>
  `
    )
    .join("");
  sendMail({
    email,
    subject: "MovieMate Order Confirmed",
    html: `<h1>This is your order details : </h1>
      <p> Buyer : ${order.name}</p>
      <p> OrderId : ${order.id}</p>
      <p> Total : $${order.total}</p>
      <p> Type : ${order.type}</p>
      <h2>Products:</h2>
      <ul>
        ${productsList}
      </ul>
    `,
  });
});

const create = async (payload) => {
  payload.id = uuidv4();
  // check movie seats count
  for (const product of payload.products) {
    const movie = await movieModel.findOne({ _id: product?.movie });
    if (!movie) throw new Error("No Movie Found");
    if (movie.seats < product?.quantity)
      throw new Error("Seats are not available");
    // Add movie title to product object
    product.movieTitle = movie.title;
  }
  // create the order
  const order = await orderModel.create(payload);
  if (!order)
    throw new Error(
      "There was a problem while processing your order. Please try again."
    );
  for (const product of order.products) {
    const movie = await movieModel.findOne({ _id: product?.movie });
    if (!movie) throw new Error("No Movie Found");
    if (movie.seats < product?.quantity)
      throw new Error("Seats are not available");
    // subtract seats
    await movieModel.updateOne(
      { _id: product?.movie },
      {
        seats: movie?.seats - product?.quantity,
      }
    );
  }
  return order;
};

const getById = async (id) => {
  const result = await orderModel.aggregate([
    [
      {
        $match: {
          id,
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "products.movie",
          foreignField: "_id",
          as: "movieDetails",
        },
      },
      {
        $addFields: {
          products: {
            $map: {
              input: "$products",
              as: "product",
              in: {
                $mergeObjects: [
                  "$$product",
                  {
                    movie: {
                      $arrayElemAt: [
                        "$movieDetails",
                        {
                          $indexOfArray: ["$products", "$$product"],
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $unset: "movieDetails",
      },
      {
        $lookup: {
          from: "users",
          localField: "buyer",
          foreignField: "_id",
          as: "buyer",
        },
      },
      {
        $unwind: {
          path: "$buyer",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          "buyer.password": false,
          "buyer.roles": false,
          "buyer.isActive": false,
          "buyer.isEmailVerified": false,
        },
      },
    ],
  ]);
  return result[0];
};

const updateById = async (id, payload) => {
  const { status, ...rest } = payload;
  return await orderModel.findOneAndUpdate({ id }, rest, { new: true });
};

const list = async ({ page = 1, limit = 5, search }) => {
  const query = [];

  // search
  if (search.id) {
    query.push({
      $match: {
        buyer: search.id,
      },
    });
  }

  // pagination
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
            $skip: (+page - 1) * +limit, // +limit ->Number(limit)
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
    }
  );

  const result = await orderModel.aggregate(query);

  return {
    total: result[0]?.total || 0,
    orders: result[0]?.data,
    page: +page, //+page = Number(page)
    limit: +limit, //+limit = Number(limit)
  };
};

const changeStatus = async (id, payload) => {
  const order = await orderModel.findOneAndUpdate({ id }, payload, {
    new: true,
  });
  if (!order) throw new Error("Order Not Found");
  if (order?.status === "failed" || order?.status === "cancelled") {
    order?.products.map(async (product) => {
      const movie = await movieModel.findOne({ _id: product?.movie });
      if (!movie) throw new Error("Movie Not Found");
      await movieModel.updateOne(
        { _id: movie._id },
        { seats: movie?.seats + product?.quantity }
      );
    });
  }
  if (order?.status === "completed" || order?.status === "pending") {
    order?.products.map(async (product) => {
      const movie = await movieModel.findOne({ _id: product?.movie });
      if (!movie) throw new Error("Movie Not Found");
      await movieModel.updateOne(
        { _id: movie._id },
        { seats: movie?.seats - product?.quantity }
      );
    });
  }
  if (order?.status === "completed") {
    const { name, id, total, type, products } = order;
    myEvent.emit("sendOrderDetails", order?.email, {
      name,
      id,
      total,
      type,
      products,
    });
  }
  return order;
};

module.exports = { create, getById, updateById, list, changeStatus };
