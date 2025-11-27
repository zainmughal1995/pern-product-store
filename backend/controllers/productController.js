import { sql } from "../config/db.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await sql`
            SELECT * FROM product
            ORDER BY created_at DESC
        `;

    console.log("Fetched Products: ", products);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error getProducts", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const createProduct = async (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const newProduct = await sql`
        INSERT INTO product (name, price, image)
        VALUES (${name}, ${price}, ${image})
        RETURNING *
    `;

    console.log("New Product Added: ", newProduct);

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.log("Error in createProduct", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await sql`
    SELECT * FROM product WHERE id =${id}
    `;
    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.log("Error in getProduct", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;

  try {
    const updateProduct = await sql`
        UPDATE product
        SET name=${name}, price=${price}, image=${image}
        WHERE id=${id}
        RETURNING *
    `;

    if ((updateProduct.length = 0)) {
      return res
        .status(400)
        .json({ success: false, message: "Product Not Found" });
    }

    res.status(200).json({ success: true, data: updateProduct[0] });
  } catch (error) {
    console.log("Error in updateProduct", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteProduct = await sql`
        DELETE FROM product WHERE id=${id} RETURNING *
    `;

    if (deleteProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({ success: true, data: deleteProduct[0] });
  } catch (error) {
    console.log("Error in deleteProduct", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
