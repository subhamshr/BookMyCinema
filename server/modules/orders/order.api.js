const router = require("express").Router();
const { secureMiddleWare } = require("../../utils/secure");
const orderController = require("./order.controller");

// create new order
router.post("/", secureMiddleWare(), async (req, res, next) => {
  try {
    const result = await orderController.create(req.body);
    res.json({
      msg: "Order Created Successfully. The order is in review. Once the order has been reviewed, you will recieve an email with your order details",
      data: result,
    });
  } catch (e) {
    next(e);
  }
});

// get all orders
router.get("/", secureMiddleWare(), async (req, res, next) => {
  try {
    const { page, limit, showAll } = req.query;
    const search = {
      id: showAll && req.isAdmin ? "" : req.currentUser,
    };
    const result = await orderController.list({ page, limit, search });
    res.json({ msg: "All orders", data: result }); 
  } catch (e) {
    next(e);
  }
});

// get order by id
router.get("/:id", secureMiddleWare(), async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await orderController.getById(id);
    res.json({ msg: `One single order with order id : ${id}`, data: result });
  } catch (e) {
    next(e);
  }
});

//change status by id
router.patch(
  "/:id/status",
  secureMiddleWare(["admin"]),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      req.body.approvedBy = req.currentUser;
      const result = await orderController.changeStatus(id, req.body);
      res.json({ msg: `status changed of order of id : ${id}`, data: result });
    } catch (e) {
      next(e);
    }
  }
);

//update order  by id
router.put("/:id", secureMiddleWare(["admin"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await orderController.updateById(id, req.body);
    res.json({ msg: `updated order of id : ${id}`, data: result });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
