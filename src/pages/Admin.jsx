import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardStats from '../components/DashboardStats';

const Admin = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [productCount, setProductCount] = useState(0);
    const [allProducts, setAllProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        categoryId: 1,
        images: ['https://placeimg.com/640/480/any']
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            // Fetch categories
            const catRes = await axios.get('https://api.escuelajs.co/api/v1/categories');
            setCategories(catRes.data);

            // Fetch API Products
            const prodRes = await axios.get('https://api.escuelajs.co/api/v1/products');

            // Fetch Local & Deleted
            const localProducts = JSON.parse(localStorage.getItem('local_products') || '[]');
            const deletedIds = JSON.parse(localStorage.getItem('deleted_products') || '[]');

            // Filter API products (exclude deleted)
            const activeApiProducts = prodRes.data.filter(p => !deletedIds.includes(p.id));

            // Merge logic: Local products override API products with the same ID
            // (In this simple case, we just concat, but the Shop/Home logic handles precedence. 
            // Here we just want a list of "Active" products to manage)

            // To be safe for management: Show Local items, and Show API items that are NOT in Local (if we supported override by ID, but we usually create NEW IDs for local).
            // Actually, if we Edit an API product, we will save it as a Local product with the Same ID.
            // So we should filter out API products that have a matching ID in localProducts.

            const localIds = new Set(localProducts.map(p => p.id));
            const uniqueApiProducts = activeApiProducts.filter(p => !localIds.has(p.id));

            const finalProducts = [...localProducts, ...uniqueApiProducts];

            setAllProducts(finalProducts);
            setProductCount(finalProducts.length);
        } catch (err) {
            console.error("Failed to fetch data", err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, images: [e.target.value] });
    };

    // Populate form for editing
    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            title: product.title,
            price: product.price,
            description: product.description,
            categoryId: product.category.id,
            images: product.images
        });
        setActiveTab('add-product');
        setSuccess(false);
        setError(null);
    };

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        // 1. Check if it's local
        let localProducts = JSON.parse(localStorage.getItem('local_products') || '[]');
        const isLocal = localProducts.some(p => p.id === id);

        if (isLocal) {
            // Remove from local
            localProducts = localProducts.filter(p => p.id !== id);
            localStorage.setItem('local_products', JSON.stringify(localProducts));
        } else {
            // Add to blacklist (API product)
            const deletedIds = JSON.parse(localStorage.getItem('deleted_products') || '[]');
            deletedIds.push(id);
            localStorage.setItem('deleted_products', JSON.stringify(deletedIds));
        }

        // Refresh list
        fetchData();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const localProducts = JSON.parse(localStorage.getItem('local_products') || '[]');

            if (editingProduct) {
                // UPDATE EXISTING
                const updatedProduct = {
                    ...editingProduct,
                    title: formData.title,
                    price: parseInt(formData.price),
                    description: formData.description,
                    category: categories.find(c => c.id === parseInt(formData.categoryId)) || editingProduct.category,
                    images: formData.images
                };

                // If it was an API product (not in local yet), we add it to local now (Override)
                const existingIndex = localProducts.findIndex(p => p.id === editingProduct.id);

                if (existingIndex >= 0) {
                    localProducts[existingIndex] = updatedProduct;
                } else {
                    localProducts.push(updatedProduct);
                }

                localStorage.setItem('local_products', JSON.stringify(localProducts));

            } else {
                // CREATE NEW
                const newProduct = {
                    id: Date.now(),
                    title: formData.title,
                    price: parseInt(formData.price),
                    description: formData.description,
                    category: categories.find(c => c.id === parseInt(formData.categoryId)) || { name: 'Local', id: 999 },
                    images: formData.images
                };

                localProducts.push(newProduct);
                localStorage.setItem('local_products', JSON.stringify(localProducts));

                // Try API (optional)
                try {
                    await axios.post('https://api.escuelajs.co/api/v1/products', {
                        title: formData.title,
                        price: parseInt(formData.price),
                        description: formData.description,
                        categoryId: parseInt(formData.categoryId),
                        images: formData.images
                    });
                } catch (apiErr) { console.warn("API upload failed", apiErr); }
            }

            setSuccess(true);
            setLoading(false);

            // Reset
            setFormData({
                title: '',
                price: '',
                description: '',
                categoryId: 1,
                images: ['https://placeimg.com/640/480/any']
            });
            setEditingProduct(null);
            fetchData(); // Refresh lists

            // If we were editing, switch back to manage? Or stay here to show success?
            // Let's stay and maybe the user wants to add another.
            if (editingProduct) setActiveTab('manage');

        } catch (err) {
            console.error(err);
            setError("Failed to save product.");
            setLoading(false);
        }
    };

    return (
        <div className="home-container" style={{ maxWidth: '1000px', margin: '4rem auto' }}>
            <h1 className="hero-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Admin Dashboard</h1>

            <div className="admin-tabs">
                <button
                    className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    Overview
                </button>
                <button
                    className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
                    onClick={() => setActiveTab('manage')}
                >
                    Manage Products
                </button>
                <button
                    className={`tab-btn ${activeTab === 'add-product' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('add-product');
                        setEditingProduct(null);
                        setFormData({
                            title: '', price: '', description: '', categoryId: 1, images: ['https://placeimg.com/640/480/any']
                        });
                        setSuccess(false);
                    }}
                >
                    {editingProduct ? 'Edit Product' : 'Add Product'}
                </button>
            </div>

            {activeTab === 'dashboard' && <DashboardStats productCount={productCount} />}

            {activeTab === 'manage' && (
                <div>
                    <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>All Products</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                                    <th style={{ padding: '1rem' }}>Image</th>
                                    <th style={{ padding: '1rem' }}>Title</th>
                                    <th style={{ padding: '1rem' }}>Price</th>
                                    <th style={{ padding: '1rem' }}>Category</th>
                                    <th style={{ padding: '1rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allProducts.map(product => (
                                    <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '0.5rem 1rem' }}>
                                            <img src={product.images[0]} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                        </td>
                                        <td style={{ padding: '0.5rem 1rem', maxWidth: '300px' }}>{product.title}</td>
                                        <td style={{ padding: '0.5rem 1rem' }}>${product.price}</td>
                                        <td style={{ padding: '0.5rem 1rem' }}>{product.category.name}</td>
                                        <td style={{ padding: '0.5rem 1rem' }}>
                                            <button
                                                onClick={() => handleEdit(product)}
                                                style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                style={{ padding: '0.25rem 0.5rem', cursor: 'pointer', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'add-product' && (
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h2>

                    {success && <div className="success-message" style={{ background: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        Product {editingProduct ? 'updated' : 'created'} successfully!
                    </div>}
                    {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Product Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                className="login-input"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Premium Leather Jacket"
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                required
                                className="login-input"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="e.g. 199"
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Category</label>
                            <select
                                name="categoryId"
                                className="login-input"
                                value={formData.categoryId}
                                onChange={handleChange}
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Image URL</label>
                            <input
                                type="url"
                                className="login-input"
                                value={formData.images[0]}
                                onChange={handleImageChange}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Description</label>
                            <textarea
                                name="description"
                                required
                                className="login-input"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter product description..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loading}
                            style={{ marginTop: '1rem' }}
                        >
                            {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Admin;
