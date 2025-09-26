import mongoose from "mongoose";
import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, data: products }); // ✅ fixed
  } catch (error) {
    console.log("Error in fetching all products", error.message);
    res.status(500).json({ success: false, message: "Server Error" }); // ✅ fixed
  }
};

export const createProduct = async (req, res) => {
  const product = req.body; //user will send this data.

  if (!product.name || !product.price || !product.image) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" }); // ✅ fixed
  }

  const newProduct = new Product(product);

  try {
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct }); // ✅ fixed
  } catch (error) {
    console.log("Error in create product", error.message);
    res.status(501).json({ success: false, message: "server error" }); // ✅ fixed
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Product ID" }); // ✅ fixed
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedProduct }); // ✅ fixed
  } catch (error) {
    console.log("Error in updating the product");
    res.status(500).json({ success: false, message: "Server Error" }); // ✅ fixed
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Product ID" }); // ✅ fixed
  }

  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Deleted Product" }); // ✅ fixed
  } catch (error) {
    console.log("Error in Deleting Product", error.message);
    res.status(500).json({ success: false, message: "Server Error" }); // ✅ fixed
  }
};
