const { v4: uuidv4 } = require("uuid");
const createHttpError = require("http-errors");
const productModel = require("../models/products");
const cloudinary = require("../configs/cloudinary");
const { response } = require("../helper/common");
const newError = require("http-errors");

// Create product
const createProducts = async (req, res, next) => {
  try {
    const {
      name,
      price,
      color,
      size,
      stock,
      condition,
      description,
      category,
      stores_id,
    } = req.body;

    const products_id = uuidv4();

    if (!name || !price || !stores_id || !category) {
      return next(
        createHttpError(
          400,
          "Missing required fields: name, price, stores_id, and category are required."
        )
      );
    }

    let imageUrl = "";
    if (req.file) {
      try {
        const uploadToCloudinary = await cloudinary.uploader.upload(
          req.file.path,
          {
            folder: "blanja/product",
          }
        );

        imageUrl = uploadToCloudinary.secure_url;
      } catch (uploadError) {
        return next(
          createHttpError(400, "Upload image failed: " + uploadError.message)
        );
      }
    }

    const data = {
      products_id,
      name,
      image: imageUrl,
      price,
      color: color || "",
      size: size || "",
      stock: stock || null,
      condition: condition || "",
      description: description || "",
      category,
      stores_id,
    };

    const result = await productModel.insertProduct(data);

    if (result?.rowCount > 0) {
      return res.status(201).json({
        message: "Create product success",
        data,
      });
    } else {
      return next(createHttpError(500, "Failed to create product"));
    }
  } catch (error) {
    return next(createHttpError(500, error.message));
  }
};

// Get all products
const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 3);
    const sort = req.query.sort || "name";
    const sortBy = req.query.sortBy || "ASC";
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    const { rows } = await productModel.selectAllProducts({
      limit,
      offset,
      sort,
      sortBy,
      search,
    });
    const {
      rows: [count],
    } = await productModel.countDataProduct(search);
    const totalData = count.total;
    const totalPage = Math.ceil(totalData / limit);
    const pagination = {
      limit,
      page,
      totalData,
      totalPage,
    };

    return res.status(200).json({
      message: "Get products success",
      data: rows,
      pagination,
    });
  } catch (error) {
    return next(createHttpError(500, error.message));
  }
};

//Get products by category
const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);
    const sort = req.query.sort;
    const sortBy = req.query.sortBy || "ASC";
    const offset = (page - 1) * limit;

    const { rows } = await productModel.selectProductsByCategory({
      category,
      limit,
      offset,
      sort,
      sortBy,
    });

    const { rows: count } = await productModel.countDataProduct(category);
    const totalData = count.total;
    const totalPage = Math.ceil(totalData / limit);

    const pagination = {
      limit,
      page,
      totalData,
      totalPage,
    };

    res.status(200).json({
      message: "Get products by category success",
      data: rows,
      pagination,
    });
  } catch (error) {
    next(createHttpError(500, error.message));
  }
};

// Get detail product
const getDetailProduct = async (req, res, next) => {
  try {
    const products_id = req.params.id;
    const {
      rows: [product],
    } = await productModel.selectDetailProduct(products_id);
    if (!product) {
      return next(createHttpError(404, "Product not found"));
    }
    return res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    return next(createHttpError(500, error.message));
  }
};

// Get products by stores_id
const getAllProductsByStoresId = async (req, res, next) => {
  try {
    const stores_id = req.query.stores_id;
    if (!stores_id) {
      return next(
        createHttpError(400, "Missing required field: stores_id is required.")
      );
    }

    const result = await productModel.selectProductByStoresId(stores_id);
    if (!result.success) {
      return next(createHttpError(404, result.message));
    }

    return res.status(200).json({
      message: "Get products by stores_id success",
      data: result.data,
    });
  } catch (error) {
    return next(createHttpError(500, error.message));
  }
};

// Get products by login
const getAllProductsByLogin = async (req, res, next) => {
  try {
    const email = req.decoded.email;

    const { rows } = await productModel.readAllProductsByLogin(email);

    if (rows == 0) {
      return next(new newError.NotFound("Product Not Found"));
    }
    response(res, rows, 200, "get Products success");
  } catch (error) {
    console.log(error);
    next(new newError.InternalServerError());
  }
};
// Get Address

// Update product
const updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      color,
      size,
      stock,
      condition,
      description,
      category,
    } = req.body;

    const products_id = req.params.id;

    if (!name || !price || !category) {
      return next(
        createHttpError(
          400,
          "Missing required fields: name, price, stores_id, and category are required."
        )
      );
    }

    let imageUrl = "";
    if (req.file) {
      try {
        const uploadToCloudinary = await cloudinary.uploader.upload(
          req.file.path,
          {
            folder: "blanja/product",
          }
        );

        imageUrl = uploadToCloudinary.secure_url;
      } catch (uploadError) {
        return next(
          createHttpError(400, "Upload image failed: " + uploadError.message)
        );
      }
    }

    const data = {
      products_id,
      name,
      image: imageUrl || req.body.image,
      price,
      color: color || "",
      size: size || "",
      stock: stock || null,
      condition: condition || "",
      description: description || "",
      category,
    };

    const result = await productModel.updateProduct(data);

    if (result?.rowCount > 0) {
      return res.status(200).json({
        message: "Update product success",
        data,
      });
    } else {
      return next(createHttpError(500, "Failed to update product"));
    }
  } catch (error) {
    return next(createHttpError(500, error.message));
  }
};

// Delete product
const deleteProduct = async (req, res, next) => {
  try {
    const products_id = req.params.id;

    const result = await productModel.deleteProduct(products_id);

    if (result?.rowCount > 0) {
      return res.status(200).json({
        message: "Delete product success",
      });
    } else {
      return next(createHttpError(404, "Product not found"));
    }
  } catch (error) {
    return next(createHttpError(500, error.message));
  }
};

module.exports = {
  createProducts,
  getAllProducts,
  getDetailProduct,
  getAllProductsByStoresId,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getAllProductsByLogin,
};
