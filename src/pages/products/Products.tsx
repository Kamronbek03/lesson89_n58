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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const {
    loading,
    products,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("default");
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
      updateProduct(editProduct.id, { ...newProduct });
      setEditProduct(null);
    } else {
      addProduct(newProduct);
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

  const isFormValid = () => {
    return (
      newProduct.title.trim() !== "" &&
      newProduct.brand.trim() !== "" &&
      newProduct.category.trim() !== "" &&
      newProduct.price > 0
    );
  };

  const filteredProducts = products
    .filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (categoryFilter === "All" || product.category === categoryFilter)
    )
    .sort((a, b) => {
      if (sortOption === "priceAsc") return a.price - b.price;
      if (sortOption === "priceDesc") return b.price - a.price;
      return 0; // No sorting by default
    });

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div style={{ padding: "20px", overflowY: "auto" }}>
      <h2>{t("productsTitle")}</h2>
      {loading && <h2>{t("loading")}</h2>}
      {error && <h2>{error}</h2>}

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <TextField
          label={t("searchByTitle")}
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <FormControl variant="outlined" style={{ minWidth: 200 }}>
          <InputLabel>{t("filterByCategory")}</InputLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            label={t("filterByCategory")}
          >
            <MenuItem value="All">{t("all")}</MenuItem>
            <MenuItem value="Headphones">{t("headphones")}</MenuItem>
            <MenuItem value="Smartwatches">{t("smartwatches")}</MenuItem>
            <MenuItem value="Gaming Consoles">{t("gamingConsoles")}</MenuItem>
            <MenuItem value="Laptops">{t("laptops")}</MenuItem>
            <MenuItem value="Smartphones">{t("smartphones")}</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" style={{ minWidth: 200 }}>
          <InputLabel>{t("sortByPrice")}</InputLabel>
          <Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            label={t("sortByPrice")}
          >
            <MenuItem value="default">{t("default")}</MenuItem>
            <MenuItem value="priceAsc">{t("priceAsc")}</MenuItem>
            <MenuItem value="priceDesc">{t("priceDesc")}</MenuItem>
          </Select>
        </FormControl>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>{t("title")}</TableCell>
              <TableCell>{t("brand")}</TableCell>
              <TableCell>{t("category")}</TableCell>
              <TableCell>{t("price")}</TableCell>
              <TableCell>{t("actions")}</TableCell>
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
                        {t("save")}
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          setEditProduct(null);
                          resetProductForm();
                        }}
                      >
                        {t("cancel")}
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
                        {t("edit")}
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setDeleteConfirm(product.id)}
                      >
                        {t("delete")}
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
                    label={t("title")}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={newProduct.brand}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, brand: e.target.value })
                    }
                    label={t("brand")}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    label={t("category")}
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
                    label={t("price")}
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
                    {t("addProduct")}
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(filteredProducts.length / rowsPerPage)}
        page={page}
        onChange={handlePageChange}
        style={{ marginTop: "20px" }}
      />

      {deleteConfirm && (
        <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
          <DialogTitle>{t("confirmDeleteProduct")}</DialogTitle>
          <DialogContent>
            <p>{t("deleteProductWarning")}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirm(null)} color="primary">
              {t("cancel")}
            </Button>
            <Button
              onClick={() => handleDeleteProduct(deleteConfirm)}
              color="secondary"
            >
              {t("delete")}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Products;
