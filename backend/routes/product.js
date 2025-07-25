const express = require("express");
const { productModel } = require("../models/ProductModel");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { productName, imageUrl, price, quantity } = req.body;
    if (!productName || !imageUrl || !price || !quantity) {
      return res
        .status(400)
        .json({ error: "please provide proper detail of prroduct" });
    }

    const newProduct = new productModel({
      productName,
      imageUrl,
      price,
      quantity,
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Product api is not working", err);
  }
});

router.get('/',async(req,res)=>{
    try {
        const product = await productModel.find({});
        res.json(product);
    } catch (error) {
        res.status(500).json({message: "something went wrong"});
    }
});

module.exports = router;