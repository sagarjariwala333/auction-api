const { insertItem, getAllItems } = require("../Controllers/ItemController");
const { userVerification } = require("../Middlewares/AuthMiddleware");

const router = require("express").Router();

router.use('/',userVerification)
router.post("/insert", insertItem);
router.get("/getAll", getAllItems);


module.exports = router;