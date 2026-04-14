const BASE_URL = 'https://dummyjson.com';

const getLocalRatings = () => {
    try {
        return JSON.parse(localStorage.getItem('user_ratings')) || {};
    } catch {
        return {};
    }
};

export const addRating = (productId, rating) => {
    const ratings = getLocalRatings();
    if (!ratings[productId]) {
        ratings[productId] = { sum: 0, count: 0 };
    }
    ratings[productId].sum += rating;
    ratings[productId].count += 1;
    localStorage.setItem('user_ratings', JSON.stringify(ratings));
};

const applyLocalRating = (product) => {
    const localRatings = getLocalRatings();
    const local = localRatings[product.id];
    let finalRating = product.rating || 0;

    // Assume original dummy rating means 10 votes
    if (local && local.count > 0) {
        const dummyVotes = finalRating > 0 ? 10 : 0;
        finalRating = ((finalRating * dummyVotes) + local.sum) / (dummyVotes + local.count);
    }
    return { ...product, rating: finalRating, ratingCount: (finalRating > 0 ? 10 : 0) + (local ? local.count : 0) };
};

export const getProducts = async () => {
    try {
        const response = await fetch(`${BASE_URL}/products?limit=100`);
        if (!response.ok) throw new Error('Error al cargar productos');
        const data = await response.json();

        // Mapear los datos de DummyJSON a nuestra interfaz
        return data.products.map(product => applyLocalRating({
            id: product.id,
            name: product.title,
            price: product.price,
            category: mapCategory(product.category),
            image: product.thumbnail,
            description: product.description,
            rating: product.rating,
            gallery: product.images || [product.thumbnail]
        }));
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

export const getProductById = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/products/${id}`);
        if (!response.ok) throw new Error('Error al cargar el producto');
        const product = await response.json();

        return applyLocalRating({
            id: product.id,
            name: product.title,
            price: product.price,
            category: mapCategory(product.category),
            image: product.thumbnail,
            description: product.description,
            rating: product.rating,
            gallery: product.images || [product.thumbnail]
        });
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
};

export const getCategories = async () => {
    try {
        const response = await fetch(`${BASE_URL}/products/categories`);
        if (!response.ok) throw new Error('Error al cargar categorías');
        const categories = await response.json();
        // DummyJSON devuelve objetos con {slug, name} en versiones recientes, 
        // o solo strings en versiones antiguas. Manejamos ambos.
        const catList = categories.map(c => typeof c === 'string' ? c : c.slug);
        return ['Todas', ...catList.map(c => mapCategory(c))];
    } catch (error) {
        console.error("Error fetching categories:", error);
        return ['Todas'];
    }
};

// Función auxiliar para traducir categorías de DummyJSON
const mapCategory = (category) => {
    const mapping = {
        "smartphones": "Smartphones",
        "laptops": "Laptops",
        "fragrances": "Fragancias",
        "skincare": "Cuidado de Piel",
        "groceries": "Comestibles",
        "home-decoration": "Decoración",
        "furniture": "Muebles",
        "tops": "Ropa Superior",
        "womens-dresses": "Vestidos",
        "womens-shoes": "Calzado Mujer",
        "mens-shirts": "Camisas Hombre",
        "mens-shoes": "Calzado Hombre",
        "mens-watches": "Relojes Hombre",
        "womens-watches": "Relojes Mujer",
        "womens-bags": "Bolsos",
        "womens-jewellery": "Joyería",
        "sunglasses": "Gafas",
        "automotive": "Automotriz",
        "motorcycle": "Motocicletas",
        "lighting": "Iluminación"
    };
    return mapping[category] || category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
};

export const products = [];
