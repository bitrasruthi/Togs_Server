const { Categories, Products } = require("../models/productModel");
const crypto = require("crypto");
const backblazeB2 = require("backblaze-b2");

const elements = process.env;
var fileName = "";

module.exports.getCategory = async (req, res) => {
  try {
    const categories = await Categories.find();

    // const productsWithImageLinks = categories.map((category) => {
    //   const imageLink = `data:${
    //     category.image
    //   };base64,${category.image.buffer.toString("base64")}`;
    //   return { ...category.toObject(), imageLink };
    // });

    res.json({ success: true, category: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

module.exports.addCategory = async (req, res) => {
  try {
    const { categoryId, category, subCategory } = req.body;

    const imageBuffer = req.file.buffer;
    const imageBase64 = imageBuffer.toString("base64");

    const categorys = new Categories({
      categoryId,
      category,
      subCategory,
      image: imageBase64,
    });
    await categorys.save();
    res.send("Saved successfully");
  } catch (err) {
    console.error(err);
    res.send({ error: err, msg: "Something went wrong!" });
  }
};

// Products

module.exports.getProduct = async (req, res) => {
  try {
    const products = await Products.find();

    const productsWithImageLinks = products.map((product) => {
      const imageLink = `data:${
        product.images
      };base64,${product.images.buffer.toString("base64")}`;
      return { ...product.toObject(), imageLink };
    });

    res.json({ success: true, products: productsWithImageLinks });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

module.exports.getProductByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Categories.findOne({ categoryId });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const products = await Products.find({ categoryId });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.getProductByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Products.findOne({ productId });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.addProduct = async (req, res) => {
  try {
    const {
      productId,
      productName,
      productTitle,
      ratings,
      noOfRatings,
      originalPrice,
      offerPrice,
      discount,
      productDetails,
      availableSizes,
      Reviews,
      specifications,
      otherDetails,
      categoryId,
    } = req.body;

    const fileDataResponse = await uploadAllFiles(req.files);
    console.log(fileDataResponse);

    if (fileDataResponse) {
      const category = await Categories.findOne({ categoryId });
      if (!category) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid categoryId" });
      }

      const product = new Products({
        productId,
        productName,
        productTitle,
        ratings,
        noOfRatings,
        originalPrice,
        offerPrice,
        discount,
        productDetails,
        availableSizes,
        Reviews,
        specifications,
        otherDetails,
        categoryId,
        imageUrl: fileDataResponse[0].imageUrl,
        images: fileDataResponse.map((fileData) => fileData.imageUrl),
      });

      console.log(product);

      await product.save();
      res.send("Saved successfully");
    } else {
      res.send("File upload not successful");
    }
  } catch (err) {
    console.error(err);
    res.send({ error: err, msg: "Something went wrong!" });
  }
};

const b2 = new backblazeB2({
  accountId: elements.B2_ACCOUNT_ID,
  applicationKey: elements.B2_APPLICATION_KEY,
});

const uploadData = async (fileBuffer, originalname) => {
  const authResponse = await b2.authorize();

  const uploadresponse = await b2.getUploadUrl({
    bucketId: elements.B2_BUCKET_ID,
    headers: {
      Authorization: authResponse.data.authorizationToken,
    },
  });

  const sha1Hash = crypto.createHash("sha1").update(fileBuffer).digest("hex");

  try {
    const fileInfo = await b2.uploadFile({
      uploadUrl: uploadresponse.data.uploadUrl,
      uploadAuthToken: uploadresponse.data.authorizationToken,
      fileName: originalname,
      data: fileBuffer,
      contentLength: fileBuffer.length,
      hash: sha1Hash,
    });

    return {
      // imageUrl: `https://f005.backblazeb2.com/file/${elements.B2_BUCKET_NAME}/${originalname}`,
      imageUrl: `https://${elements.B2_BUCKET_NAME}.s3.us-east-005.backblazeb2.com/${originalname}`,
      fileId: fileInfo.data.fileId,
      fileName: originalname,
    };
  } catch (error) {
    console.error("Error uploading image to Backblaze B2:", error);
    throw error;
  }
};

const uploadAllFiles = async (files) => {
  const fileDataResponse = [];
  for (const file of files) {
    const fileResponse = await uploadData(file.buffer, file.originalname);
    fileDataResponse.push(fileResponse);
  }
  return fileDataResponse;
};
