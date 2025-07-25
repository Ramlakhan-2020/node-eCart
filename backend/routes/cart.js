const express = require("express");

const { productModel } = require("../models/ProductModel");
const {cartModel} = require("../models/CartModel");
const verifyUser = require("../middleware/VerifyUser");

const router= express.Router();

router.post('/additem', verifyUser, async (req,res)=>{
    try{
        const io = req.app.get("io");
        const userId = req.user._id
        const { productId, quantity } = req.body;
        const product = await productModel.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });
        let cart = await cartModel.findOne({ userId });
        if(!cart){
            cart = new cartModel({
                userId,
                items: [
                    {
                        productId,
                        productName: product.productName,
                        quantity: quantity || 1,
                        price: product.price
                    }
                ]
            })
        }
        else{
            // If cart exists, check if item already added
            const existingItem = cart.items.find(
                (item) => item.productId.toString() === productId
            );
           
            if (existingItem) {
                existingItem.quantity +=quantity || 1;
            }
            else{
                cart.items.push({
                    productId,
                    productName: product.productName,
                    quantity: quantity || 1,
                    price: product.price
                  });
            }
        }
        await cart.save();
        io.to(userId.toString()).emit("cartUpdated", { userId, cart });
        res.status(200).json({ message: "Item added to cart", cart });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to add to cart", error });
      }

})

// PATCH /api/cart/update
router.patch('/updateQuantity',verifyUser, async (req, res) => {
    try {
      const io = req.app.get("io");
      const userId = req.user._id;
      const { productId, quantity } = req.body;

      const cart = await cartModel.findOne({ userId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      const item = cart.items.find(
        (item) => item.productId.toString() === productId
      );
  
      if (!item) return res.status(404).json({ message: "Product not in cart" });
      
      item.quantity = quantity;

      await cart.save();
      io.to(userId.toString()).emit("cartUpdated", { userId, cart });
      res.status(200).json({ message: "Quantity updated", cart });
    } catch (error) {
      res.status(500).json({ message: "Failed to update quantity", error });
    }
  });

  router.get('/',verifyUser ,async (req,res)=>{
    const userId = req.user._id;
     try {
        const cartData = await cartModel.findOne({userId: userId});
        res.status(200).json(cartData);
     }
     catch(err){
        console.error("cart GetApi error:", err);
     }
  })

// DELETE /api/cart/itemDelete
router.delete('/itemDelete', verifyUser, async (req,res)=>{
    try {
        const io = req.app.get("io");
        const userId = req.user._id;
        const {productId} = req.body;

        const cart = await cartModel.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();
        
        io.to(userId.toString()).emit("cartUpdated", { userId, cart });
        
        res.json({ message: "Item removed from cart", cart });

    } catch (error) {
        res.status(500).json({ message: "Failed to remove item", error });
    }
})  

  module.exports = router; 
  