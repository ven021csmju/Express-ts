// // import { QueryError, PoolConnection } from "mysql2";
// // import { connection } from "../config/db";
// // import { Product } from "../model/product";
// import { RowDataPacket } from "mysql2"; // Import type for rows returned from queries
// import { promisePool } from "../config/db";
// // import { Request, Response } from "express"; // Import Request and Response from express

// const selectAll = async () => {
//   try {
//     const [rows]: [RowDataPacket[], any] = await promisePool.query(
//       "SELECT * FROM product"
//     );
//     return rows;
//   } catch (err) {
//     console.error("Database query error:", err);
//   }
// };

// export default { selectAll };

import { RowDataPacket, ResultSetHeader } from "mysql2";
import { promisePool } from "../config/db";

// Function to select all products
const selectAll = async (): Promise<RowDataPacket[]> => {
  try {
    const [rows]: [RowDataPacket[], any] = await promisePool.query(
      "SELECT * FROM product"
    );
    return rows;
  } catch (err) {
    console.error("Database query error:", err);
    throw err; // Ensure the error is thrown so that the caller can handle it
  }
};

// Function to delete a product by ID
const deleteProductById = async (id: number): Promise<void> => {
  try {
    console.log(`Attempting to delete product with ID: ${id}`);
    const [result] = await promisePool.query<ResultSetHeader>(
      "DELETE FROM product WHERE id = ?",
      [id]
    );
    console.log("Delete result:", result);
    // Optionally, you can check if the affectedRows property is 0 to handle the case where no rows were deleted
    if ((result as ResultSetHeader).affectedRows === 0) {
      console.warn(`No product found with ID: ${id}`);
    }
  } catch (err) {
    console.error("Database deletion error:", err);
    throw err; // It's good practice to throw the error after logging it
  }
};

// Function to insert a new product
const insertProduct = async (
  id: number,
  name: string,
  price: number
): Promise<void> => {
  try {
    const [result] = await promisePool.query<ResultSetHeader>(
      "INSERT INTO product (id, name, price) VALUES (?, ?, ?)",
      [id, name, price]
    );
    console.log("Insert result:", result);
    if ((result as ResultSetHeader).affectedRows === 0) {
      console.warn("Insert operation did not affect any rows");
    }
  } catch (err) {
    console.error("Database insertion error:", err);
    throw err;
  }
};

// Function to update a product by ID
const updateProduct = async (
  id: number,
  name: string,
  price: number
): Promise<void> => {
  try {
    const [result] = await promisePool.query<ResultSetHeader>(
      "UPDATE product SET name = ?, price = ? WHERE id = ?",
      [name, price, id]
    );
    console.log("Update result:", result);
    if ((result as ResultSetHeader).affectedRows === 0) {
      console.warn(`No product found with ID: ${id}`);
    }
  } catch (err) {
    console.error("Database update error:", err);
    throw err;
  }
};

export default { selectAll, deleteProductById, insertProduct, updateProduct };