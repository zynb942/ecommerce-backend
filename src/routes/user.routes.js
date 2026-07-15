const express = require("express");
const router = express.Router();
const { updateUser } = require("../controllers/user.controller"); 
const validate = require("../middlewares/validation.middleware");
const { updateUserSchema } = require("../validation/user.validation");
const { protect } = require("../middlewares/auth.middleware"); 

router.patch("/:id", protect, validate(updateUserSchema), updateUser);

module.exports = router;