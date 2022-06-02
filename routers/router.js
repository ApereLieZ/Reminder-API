const router = require("express").Router();
const controller = require("../controllers/controller");



router.get("/api",controller.AuthCheck ,(req, res) => {
    if(req.user){
        console.log(req.user);
    res.send("ok");
    }
    
})

router.get("/api/records", controller.AuthCheck, controller.getRecords);
router.post("/api/record", controller.AuthCheck, controller.setRecord);
router.delete("/api/record", controller.AuthCheck, controller.deleteRecord);
router.delete("/api/records", controller.AuthCheck, controller.deleteAllRecords);
router.post("/api/register", controller.postRegister )

router.get("/api/login", controller.getLogin)


module.exports = router;