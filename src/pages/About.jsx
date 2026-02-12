const About = () => {
    return (
        <div className="home-container" style={{ maxWidth: '800px', textAlign: 'center', padding: '4rem 2rem' }}>
            <h1 className="hero-title">About LuxeMarket</h1>
            <p className="hero-subtitle" style={{ marginBottom: '2rem' }}>
                Redefining the online shopping experience.
            </p>

            <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                    Founded in 2024, LuxeMarket has set out to create a premium e-commerce destination
                    that seamlessly blends style, quality, and technology. Our mission is to provide
                    customers with a curated selection of the finest products from around the world.
                </p>
                <p>
                    We believe that shopping should be an experience, not just a transaction.
                    That's why we've obsessed over every detail of our platform, from the
                    user interface to the product photography. Thank you for choosing LuxeMarket.
                </p>
            </div>
        </div>
    );
};

export default About;
