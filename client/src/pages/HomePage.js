import React from 'react';
import './HomePage.css'; // Assuming you'll create this CSS file for styling

const HomePage = () => {
    const featuredProducts = [
        { id: 1, name: 'Product 1', price: '$99.99' },
        { id: 2, name: 'Product 2', price: '$149.99' },
        { id: 3, name: 'Product 3', price: '$199.99' },
        // Add more products as needed
    ];

    return (
        <div className="home-page">
            <header className="header">
                <h1>Featured Products</h1>
                <input type="text" placeholder="Search..." className="search-bar" />
                <div className="category-filters">
                    <button>All</button>
                    <button>Category 1</button>
                    <button>Category 2</button>
                    <button>Category 3</button>
                </div>
            </header>
            <div className="product-grid">
                {featuredProducts.map(product => (
                    <div key={product.id} className="product-card">
                        <h2>{product.name}</h2>
                        <p>{product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;