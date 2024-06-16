const { Router } = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  getCategory,
  addCategory,
  getProduct,
  addProduct,
  getProductByProductId,
  getProductByCategoryId,
} = require("../controllers/productsController");

const router = Router();

router.get("/getCategories", getCategory);
router.post("/addCategory", upload.single("image"), addCategory);
router.post("/addProduct", upload.array("images"), addProduct);
router.get("/products", getProduct);
router.get("/products/:categoryId", getProductByCategoryId);
router.get(
  "/products/:categoryId/productDetails/:productId",
  getProductByProductId
);

module.exports = router;
