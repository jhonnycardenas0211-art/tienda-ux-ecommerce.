const Skeleton = ({ width, height, borderRadius = '4px' }) => {
    return (
        <div
            className="skeleton"
            style={{
                width: width || '100%',
                height: height || '20px',
                borderRadius
            }}
        />
    );
};

export const ProductSkeleton = () => (
    <div className="product-card" style={{ padding: '0' }}>
        <div className="product-img-container">
            <Skeleton height="100%" />
        </div>
        <div className="product-info">
            <Skeleton width="80%" height="15px" />
            <Skeleton width="40%" height="20px" style={{ marginTop: '0.5rem' }} />
            <Skeleton width="100%" height="35px" style={{ marginTop: '1rem' }} />
            <Skeleton width="100%" height="35px" style={{ marginTop: '0.5rem' }} />
        </div>
    </div>
);

export default Skeleton;
