const router = require("express").Router();
const controller = require("../controllers/auth_controller");

router.use(controller.AuthCheck);

router.get("/api",controller.AuthCheck ,(req, res) => {
    if(req.user){
        console.log(req.user);
    res.send("ok");
    }
    
})

router.get("/api/records", controller.getRecords);
router.post("/api/record", controller.setRecord);
router.delete("/api/record", controller.deleteRecord);
router.delete("/api/records", controller.deleteAllRecords);

module.exports = router;