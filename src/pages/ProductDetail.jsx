import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ArrowLeft } from 'lucide-react';
import { getProductById, addRating } from '../services/products';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, toggleFavorite, favorites } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const data = await getProductById(id);
            if (data) {
                setProduct(data);
                setSelectedImage(data.image);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    const handleRate = (ratingValue) => {
        addRating(product.id, ratingValue);
        // Locally update product so UI is responsive
        const dummyVotes = product.ratingCount || (product.rating > 0 ? 10 : 0);
        const newCount = dummyVotes + 1;
        const newSum = (product.rating * dummyVotes) + ratingValue;
        setProduct({ ...product, rating: newSum / newCount, ratingCount: newCount });
    };

    const isFavorite = favorites.some(f => f.id === product?.id);

    if (loading) {
        return (
            <div className="container" style={{ padding: '3rem 0' }}>
                <div className="product-detail-layout">
                    <div style={{ aspectRatio: '1', backgroundColor: '#1a1a1a', borderRadius: 'var(--radius-md)' }}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ height: '3rem', width: '70%', backgroundColor: '#1a1a1a', borderRadius: 'var(--radius-sm)' }}></div>
                        <div style={{ height: '2rem', width: '30%', backgroundColor: '#1a1a1a', borderRadius: 'var(--radius-sm)' }}></div>
                        <div style={{ height: '10rem', width: '100%', backgroundColor: '#1a1a1a', borderRadius: 'var(--radius-sm)' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Producto no encontrado</h2>
        <button className="btn-outline" onClick={() => navigate('/')}>Volver al catálogo</button>
    </div>;

    return (
        <div className="container" style={{ padding: '3rem 0' }}>
            <button
                onClick={() => navigate(-1)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
                <ArrowLeft size={20} /> Volver
            </button>

            <div className="product-detail-layout">
                {/* Left: Images */}
                <div>
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: 'var(--radius-md)',
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        marginBottom: '1.5rem',
                        overflow: 'hidden'
                    }}>
                        <img
                            src={selectedImage}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'all 0.3s ease', filter: product.filter || 'none' }}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        {product.gallery.map((img, i) => (
                            <div
                                key={i}
                                onClick={() => setSelectedImage(img)}
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: 'var(--radius-sm)',
                                    aspectRatio: '1',
                                    border: selectedImage === img ? '2px solid var(--accent-red)' : '1px solid var(--border-color)',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '5px',
                                    cursor: 'pointer',
                                    transition: 'border 0.2s'
                                }}
                            >
                                <img
                                    src={img}
                                    alt=""
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        opacity: selectedImage === img ? 1 : 0.5,
                                        filter: product.filter || 'none'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Info */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: '1.2' }}>{product.name}</h1>

                    <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem', alignItems: 'center' }} onMouseLeave={() => setHoverRating(0)}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star
                                key={i}
                                size={20}
                                fill={i <= (hoverRating || Math.floor(product.rating || 0)) ? "#ffd700" : "none"}
                                color="#ffd700"
                                style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
                                onMouseEnter={() => setHoverRating(i)}
                                onClick={() => handleRate(i)}
                            />
                        ))}
                        <span style={{ marginLeft: '0.5rem', color: 'var(--text-muted)' }}>
                            {product.ratingCount ? `(${product.rating.toFixed(1)} / ${product.ratingCount} votos)` : '(0 calif.)'}
                        </span>
                    </div>

                    <p style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1.5rem', color: 'var(--accent-red)' }}>
                        ${product.price.toLocaleString('es-CO')}
                    </p>

                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Descripción</h4>
                        <p style={{ lineHeight: '1.6', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                            {product.description}
                        </p>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Cantidad</h4>
                        <select
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                            style={{ backgroundColor: '#1a1a1a', color: 'white', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', width: '120px' }}>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                        </select>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <button
                            className="btn-primary"
                            style={{ width: '100%', padding: '1.2rem', fontSize: '1rem' }}
                            onClick={() => {
                                for (let i = 0; i < qty; i++) addToCart(product);
                            }}
                        >
                            AÑADIR AL CARRITO
                        </button>
                        <button
                            className="btn-outline"
                            style={{
                                width: '100%',
                                padding: '1.2rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                fontSize: '1rem',
                                borderColor: isFavorite ? 'var(--accent-red)' : 'white',
                                color: isFavorite ? 'var(--accent-red)' : 'white'
                            }}
                            onClick={() => toggleFavorite(product)}
                        >
                            {isFavorite ? 'EN FAVORITOS' : 'AÑADIR A FAVORITOS'} <Heart size={20} fill={isFavorite ? 'var(--accent-red)' : 'none'} color={isFavorite ? 'var(--accent-red)' : 'white'} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
