import React, { useEffect, useState } from "react";
import { useProductStore } from "../../app/productStore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
} from "@mui/material";

interface Product {
  id: string;
  title: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  comments: string;
  images: string[];
}

const Products: React.FC = () => {
  const {
    loading,
    products,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();

  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    title: "",
    description: "",
    brand: "",
    category: "",
    price: 0,
    discountPercentage: 0,
    rating: 0,
    comments: "",
    images: [],
  });

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddOrUpdateProduct = () => {
    if (editProduct) {
      // Update existing product
      updateProduct(editProduct.id, { ...newProduct });
      setEditProduct(null);
    } else {
      addProduct(newProduct); // ID avtomatik tarzda beriladi
    }
    resetProductForm();
  };

  const resetProductForm = () => {
    setNewProduct({
      title: "",
      description: "",
      brand: "",
      category: "",
      price: 0,
      discountPercentage: 0,
      rating: 0,
      comments: "",
      images: [],
    });
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  const isFormValid = () => {
    return (
      newProduct.title.trim() !== "" &&
      newProduct.brand.trim() !== "" &&
      newProduct.category.trim() !== "" &&
      newProduct.price > 0
    );
  };

  return (
    <div style={{ padding: "20px", overflowY: "auto" }}>
      <h2>Products</h2>
      {loading && <h2>Loading...</h2>}
      {error && <h2>{error}</h2>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>
                  {editProduct?.id === product.id ? (
                    <TextField
                      value={newProduct.title}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, title: e.target.value })
                      }
                    />
                  ) : (
                    product.title
                  )}
                </TableCell>
                <TableCell>
                  {editProduct?.id === product.id ? (
                    <TextField
                      value={newProduct.brand}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, brand: e.target.value })
                      }
                    />
                  ) : (
                    product.brand
                  )}
                </TableCell>
                <TableCell>
                  {editProduct?.id === product.id ? (
                    <TextField
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                    />
                  ) : (
                    product.category
                  )}
                </TableCell>
                <TableCell>
                  {editProduct?.id === product.id ? (
                    <TextField
                      type="number"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: +e.target.value })
                      }
                    />
                  ) : (
                    `$${product.price}`
                  )}
                </TableCell>
                <TableCell>
                  {editProduct?.id === product.id ? (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleAddOrUpdateProduct()}
                      >
                        Save
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          setEditProduct(null);
                          resetProductForm();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setEditProduct(product);
                          setNewProduct({
                            title: product.title,
                            description: product.description,
                            brand: product.brand,
                            category: product.category,
                            price: product.price,
                            discountPercentage: product.discountPercentage,
                            rating: product.rating,
                            comments: product.comments,
                            images: product.images,
                          });
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setDeleteConfirm(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {editProduct === null && (
              <TableRow>
                <TableCell>{products.length + 1}</TableCell>
                <TableCell>
                  <TextField
                    value={newProduct.title}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, title: e.target.value })
                    }
                    label="Title"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={newProduct.brand}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, brand: e.target.value })
                    }
                    label="Brand"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    label="Category"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: +e.target.value })
                    }
                    label="Price"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddOrUpdateProduct()}
                    disabled={!isFormValid()}
                  >
                    Add Product
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(products.length / rowsPerPage)}
        page={page}
        onChange={handlePageChange}
        style={{ marginTop: "20px" }}
      />

      {deleteConfirm && (
        <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this product?</p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleDeleteProduct(deleteConfirm)}
              color="primary"
            >
              Delete
            </Button>
            <Button onClick={() => setDeleteConfirm(null)} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Products;
