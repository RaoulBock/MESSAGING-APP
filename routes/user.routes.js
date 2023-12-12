const express = require("express");
const userCtrl = require("../controllers/user.controller");
const authCtrl = require("../controllers/auth.controller");

const router = express.Router();

router.route("/api/users").get(userCtrl.list).post(userCtrl.create);

router
  .route("/api/users/:userId")
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

// // New route for creating a payment link
// router
//   .route("/api/users/:userId/payment-link")
//   .post(authCtrl.requireSignin, userCtrl.createPaymentLink);

router.param("userId", userCtrl.userByID);

module.exports = router;
