const Sidebar = ({ categories = ['Todas'], currentCategory, setCategory, priceRange, setPriceRange }) => {
    return (
        <aside className="sidebar">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '900' }}>FILTROS</h3>

            <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--text-muted)', fontWeight: '700' }}>CATEGORÍA</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            style={{
                                textAlign: 'left',
                                background: 'none',
                                border: 'none',
                                color: currentCategory === cat ? 'var(--accent-red)' : 'white',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                fontWeight: currentCategory === cat ? '700' : '400',
                                transition: 'color 0.2s',
                                textTransform: 'uppercase'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--text-muted)', fontWeight: '700' }}>RANGO DE PRECIO</p>
                <input
                    type="range"
                    min="0"
                    max="8000000"
                    step="50000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    style={{
                        width: '100%',
                        accentColor: 'var(--accent-red)',
                        marginBottom: '0.5rem',
                        cursor: 'pointer'
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700' }}>
                    <span>$0</span>
                    <span style={{ color: 'var(--accent-red)' }}>${priceRange.toLocaleString('es-CO')}</span>
                </div>
            </div>

            <button
                className="btn-outline"
                style={{ width: '100%', fontSize: '0.7rem' }}
                onClick={() => {
                    setCategory('Todas');
                    setPriceRange(8000000);
                }}
            >
                RESETEAR FILTROS
            </button>
        </aside>
    );
};

export default Sidebar;
