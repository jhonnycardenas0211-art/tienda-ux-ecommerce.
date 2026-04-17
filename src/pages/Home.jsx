import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Search, Filter, Star } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Skeleton from '../components/common/Skeleton';
import { getProducts, getCategories } from '../services/products';
import { useCart } from '../context/CartContext';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState(['Todas']);
    const [filterCategory, setFilterCategory] = useState('Todas');
    const [priceRange, setPriceRange] = useState(8000000);
    const [sortBy, setSortBy] = useState('default');
    const { addToCart, toggleFavorite, favorites } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productsData, categoriesData] = await Promise.all([
                    getProducts(),
                    getCategories()
                ]);
                setAllProducts(productsData);
                setCategories(categoriesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredAndSortedProducts = allProducts
        .filter(p => {
            const categoryMatch = filterCategory === 'Todas' || p.category === filterCategory;
            const priceMatch = p.price <= priceRange;
            return categoryMatch && priceMatch;
        })
        .sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'rating-desc') return b.rating - a.rating;
            return 0; // default
        });

    return (
        <div className="container main-layout">
            <Sidebar
                categories={categories}
                currentCategory={filterCategory}
                setCategory={setFilterCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
            />

            <main style={{ flex: 1, paddingTop: '2rem' }}>
                <div style={{
                    maxWidth: '1000px',
                    margin: '0 auto 3rem auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border-color)',
                    paddingBottom: '1.5rem'
                }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: '1', letterSpacing: '-1px' }}>CATÁLOGO</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: '500' }}>
                            Mostrando <span style={{ color: 'white' }}>{filteredAndSortedProducts.length}</span> productos premium
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Filter size={14} color="var(--text-muted)" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    padding: '0.6rem 2rem 0.6rem 1rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 0.5rem center',
                                    backgroundSize: '1rem'
                                }}
                            >
                                <option value="default" style={{ background: '#111' }}>ORDENAR POR: NOVEDADES</option>
                                <option value="price-asc" style={{ background: '#111' }}>PRECIO: MENOR A MAYOR</option>
                                <option value="price-desc" style={{ background: '#111' }}>PRECIO: MAYOR A MENOR</option>
                                <option value="rating-desc" style={{ background: '#111' }}>MEJOR CALIFICADOS</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="product-grid" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    {loading ? (
                        Array(6).fill(0).map((_, i) => <Skeleton key={i} />)
                    ) : (
                        filteredAndSortedProducts.map(product => {
                            const isFavorite = favorites.some(f => f.id === product.id);
                            return (
                                <div
                                    key={product.id}
                                    className="product-card"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    <div className="product-image-container">
                                        <div style={{ width: '100%', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-color)', borderRadius: '1rem', overflow: 'hidden' }}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="product-image"
                                                style={{
                                                    maxHeight: '80%',
                                                    maxWidth: '80%',
                                                    objectFit: 'contain',
                                                    filter: product.filter || 'none'
                                                }}
                                            />
                                        </div>
                                        <button
                                            className="favorite-btn"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleFavorite(product);
                                            }}
                                        >
                                            <Heart size={20} fill={isFavorite ? 'var(--accent-red)' : 'none'} color={isFavorite ? 'var(--accent-red)' : 'white'} />
                                        </button>
                                        <div className="product-badge">NUEVO</div>
                                    </div>
                                    <div className="product-info">
                                        <h3 className="product-name" style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            minHeight: '2.8rem',
                                            lineHeight: '1.4'
                                        }}>{product.name}</h3>
                                        <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.5rem' }}>
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill={i <= Math.floor(product.rating || 0) ? "#ffd700" : "none"} color="#ffd700" />)}
                                        </div>
                                        <p className="product-price">${product.price.toLocaleString('es-CO')}</p>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
                                            <NavLink
                                                to={`/product/${product.id}`}
                                                className="btn-outline"
                                                style={{ textAlign: 'center', textDecoration: 'none', fontSize: '0.75rem', padding: '0.7rem' }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                DETALLES
                                            </NavLink>
                                            <button
                                                className="btn-primary"
                                                style={{ fontSize: '0.75rem', padding: '0.7rem' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(product);
                                                }}
                                            >
                                                AÑADIR
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;
