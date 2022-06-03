const router = require("express").Router();
const controller = require("../controllers/controller");

router.post("/api/register", controller.postRegister );

router.post("/api/login", controller.getLogin);


module.exports = router;