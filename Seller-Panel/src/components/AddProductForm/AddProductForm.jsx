import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../Redux/productSlice";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import styles from "./AddProductForm.module.css";

const categories = {
  Painting: ["Oil Painting", "Watercolor", "Acrylic", "Digital"],
  Craft: ["Paper Craft", "Wood Craft", "Metal Craft", "Textile Craft"],
  Sculpture: ["Stone Sculpture", "Wood Sculpture", "Clay Sculpture"],
  Jewelry: ["Necklaces", "Bracelets", "Earrings", "Rings"],
};

const tagOptions = [
  { value: "diy", label: "DIY" },
  { value: "paper", label: "Paper" },
  { value: "origami", label: "Origami" },
  { value: "creative", label: "Creative" },
  { value: "paper crafts", label: "Paper Crafts" },
  { value: "Valentine Gift", label: "Valentine Gift" },
  { value: "House Party", label: "House Party" },
  { value: "Dinner Dates", label: "Dinner Dates" },
  { value: "Baby Shower", label: "Baby Shower" },
  { value: "Anniversaries", label: "Anniversaries" },
  { value: "Diwali Lights", label: "Diwali Lights" },
  { value: "Eid", label: "Eid" },
  { value: "Christmas Eve", label: "Christmas Eve" },
];

export default function AddProductForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.products);
  const [isSuccess, setIsSuccess] = useState(false);
  const { seller } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    discount: "",
    category: "",
    subcategory: "",
    rating: 1,
    inStock: "",
    tags: [],
    images: [],
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    let updatedData = { ...formData };

    if (type === "file") {
      updatedData.images = Array.from(files);
    } else {
      updatedData[name] = value;

      // Auto-calculate discount if price or originalPrice changes
      if (name === "price" || name === "originalPrice") {
        const priceNum = parseFloat(name === "price" ? value : updatedData.price);
        const originalPriceNum = parseFloat(name === "originalPrice" ? value : updatedData.originalPrice);
        updatedData.discount = originalPriceNum && priceNum
          ? Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100)
          : "";
      }
    }
    setFormData(updatedData);
  };

  const handleTagsChange = (selectedOptions) => {
    setFormData({
      ...formData,
      tags: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = [
      "name", "description", "price", "originalPrice",
      "discount", "category", "subcategory", "rating", "inStock", "images"
    ];
    for (let field of requiredFields) {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        alert(`Please fill the required field: ${field}`);
        return;
      }
    }
    const productData = {
      ...formData,
      sellerId: seller?._id,
    };
    dispatch(addProduct(productData)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/my-products');
        }, 2000); // 2-second delay before redirecting
      } else if (result.meta.requestStatus === 'rejected' && result.payload?.status === 403) {
        alert('Your account has been blocked. You are not allowed to add new products.');
      }
    });
  };

  return (
    <div className={styles["page-container"]}>
      <div className={styles["add-product"]}>
        <div className={styles["form-top-bar"]}>
          <h2>Add Product</h2>
          <button
            className={styles["close-btn"]}
            onClick={() => navigate(-1)}
            title="Go back"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles["product-form"]}>
          <label>Product Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          <label>Product Description *</label>
          <textarea className={styles["big-textarea"]} name="description" value={formData.description} onChange={handleChange} required />

          <div className={styles["form-row"]}>
            <div className={styles["form-col"]}>
              <label>Price *</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div className={styles["form-col"]}>
              <label>Original Price *</label>
              <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} required />
            </div>
            <div className={styles["form-col"]}>
              <label>Discount % *</label>
              <input type="number" name="discount" value={formData.discount} readOnly />
            </div>
          </div>

          <div className={styles["form-row"]}>
            <div className={styles["form-col"]}>
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value, subcategory: "" })
                }
                required
              >
                <option value="">-- Select Category --</option>
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className={styles["form-col"]}>
              <label>Subcategory *</label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                disabled={!formData.category}
                required
              >
                <option value="">-- Select Subcategory --</option>
                {formData.category &&
                  categories[formData.category].map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
              </select>
            </div>
          </div>

          <div className={styles["form-row"]}>
            <div className={styles["form-col"]}>
              <label>Tags *</label>
              <Select
                isMulti
                name="tags"
                options={tagOptions}
                onChange={handleTagsChange}
                value={formData.tags.map((tag) => ({ value: tag, label: tag }))}
                placeholder="Select or add tags"
              />
            </div>
          </div>

          <div className={styles["form-row"]}>
            <div className={styles["form-col"]}>
              <label>Rating (1-5) *</label>
              <input type="number" min="1" max="5" name="rating" value={formData.rating} onChange={handleChange} required />
            </div>
            <div className={styles["form-col"]}>
              <label>In Stock *</label>
              <input type="number" name="inStock" value={formData.inStock} onChange={handleChange} required />
            </div>
            <div className={styles["form-col"]}>
              <label>Images *</label>
              <input type="file" name="images" multiple onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className={styles["publish-btn"]} disabled={loading}>
            {loading ? "Submitting for Review..." : "Submit for Review"}
          </button>

          {isSuccess && <p style={{ color: "green" }}>✅ Product submitted successfully! Redirecting...</p>}
          {error && <p style={{ color: "red" }}>❌ {typeof error === 'object' ? error.message : error}</p>}
        </form>
      </div>
    </div>
  );
}