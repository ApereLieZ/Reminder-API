const router = require("express").Router();
const controller = require("../controllers/controller");



router.get("/api",controller.AuthCheck ,(req, res) => {
    console.log(req.query);
    res.send("ok");
})

router.post("/api/register", controller.postRegister )

router.get("/api/login", controller.getLogin)


module.exports = router;