import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import { getProducts, getCategories } from '../services/products';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import Skeleton from '../components/common/Skeleton';

const Search = () => {
    const { addToCart } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('default');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productsData, categoriesData] = await Promise.all([
                    getProducts(),
                    getCategories()
                ]);
                setAllProducts(productsData);
                setCategories(['All', ...categoriesData.filter(c => c !== 'Todas')]);
            } catch (error) {
                console.error("Error fetching search data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredAndSortedProducts = useMemo(() => {
        const filtered = allProducts.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        return [...filtered].sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'rating-desc') return b.rating - a.rating;
            return 0;
        });
    }, [searchTerm, selectedCategory, allProducts, sortBy]);

    return (
        <div className="search-page container section-padding">
            <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    <h1 style={{ margin: 0 }}>Nuestra <span className="gradient-text">Colección</span></h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <SlidersHorizontal size={16} color="var(--text-muted)" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                border: '1px solid var(--border-glass)',
                                borderRadius: '12px',
                                padding: '0.6rem 2.2rem 0.6rem 1rem',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.75rem center',
                                backgroundSize: '1rem',
                                minWidth: '180px'
                            }}
                        >
                            <option value="default" style={{ background: '#111' }}>RELEVANCIA</option>
                            <option value="price-asc" style={{ background: '#111' }}>PRECIO: MENOR A MAYOR</option>
                            <option value="price-desc" style={{ background: '#111' }}>PRECIO: MAYOR A MENOR</option>
                            <option value="rating-desc" style={{ background: '#111' }}>MEJOR CALIFICADOS</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div className="glass" style={{ flex: 1, minWidth: '300px', display: 'flex', alignItems: 'center', padding: '0 1.5rem', borderRadius: '15px' }}>
                        <SearchIcon size={20} color="var(--text-muted)" />
                        <input
                            type="text"
                            placeholder="¿Qué estás buscando hoy?"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                padding: '1rem',
                                flex: 1,
                                outline: 'none',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: '12px',
                                    background: selectedCategory === cat ? 'var(--grad-premium)' : 'var(--bg-card)',
                                    color: 'white',
                                    border: '1px solid var(--border-glass)',
                                    fontWeight: '600',
                                    transition: 'all 0.3s',
                                    textTransform: 'uppercase',
                                    fontSize: '0.8rem'
                                }}
                            >
                                {cat === 'All' ? 'Todos' : cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <motion.div className="grid-products" layout>
                {loading ? (
                    Array(8).fill(0).map((_, i) => (
                        <div key={i} className="glass" style={{ borderRadius: '24px', height: '400px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '15px' }}></div>
                            <div style={{ height: '1.5rem', width: '60%', background: 'rgba(255,255,255,0.05)', borderRadius: '5px' }}></div>
                            <div style={{ height: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}></div>
                        </div>
                    ))
                ) : (
                    <AnimatePresence>
                        {filteredAndSortedProducts.map(product => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="glass card-hover"
                                style={{ borderRadius: '24px', overflow: 'hidden' }}
                            >
                                <Link to={`/product/${product.id}`}>
                                    <div style={{ aspectRatio: '1', background: 'var(--grad-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', borderRadius: '15px', overflow: 'hidden' }}>
                                            <img src={product.image} alt={product.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                                            />
                                            <ShoppingBag size={48} opacity={0.1} color="black" style={{ display: 'none' }} />
                                        </div>
                                    </div>
                                </Link>
                                <div style={{ padding: '1.5rem' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>{product.category}</span>
                                    <h4 style={{
                                        fontSize: '1.1rem',
                                        margin: '0.3rem 0',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        height: '2.8rem'
                                    }}>{product.name}</h4>
                                    <p style={{ color: 'white', fontWeight: '900', fontSize: '1.3rem', marginTop: '0.5rem' }}>${product.price.toLocaleString('es-CO')}</p>
                                    <button
                                        className="premium-btn"
                                        style={{ width: '100%', marginTop: '1rem', padding: '0.8rem', borderRadius: '12px' }}
                                        onClick={() => addToCart(product)}
                                    >
                                        Añadir al carrito
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </motion.div>

            {!loading && filteredAndSortedProducts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <h2 style={{ color: 'var(--text-muted)' }}>No encontramos lo que buscas...</h2>
                    <p>Prueba con otros términos de búsqueda.</p>
                </div>
            )}
        </div>
    );
};

export default Search;
