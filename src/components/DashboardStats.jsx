const DashboardStats = ({ productCount }) => {
    return (
        <div className="dashboard-grid">
            <div className="stat-card">
                <h3 className="stat-title">Total Sales</h3>
                <p className="stat-value">$12,450</p>
                <span className="stat-change positive">+15% from last month</span>
            </div>

            <div className="stat-card">
                <h3 className="stat-title">Total Products</h3>
                <p className="stat-value">{productCount}</p>
                <span className="stat-change neutral">Just updated</span>
            </div>

            <div className="stat-card">
                <h3 className="stat-title">Total Orders</h3>
                <p className="stat-value">154</p>
                <span className="stat-change positive">+8% from last month</span>
            </div>

            <div className="stat-card">
                <h3 className="stat-title">New Customers</h3>
                <p className="stat-value">12</p>
                <span className="stat-change negative">-2% from last month</span>
            </div>
        </div>
    );
};

export default DashboardStats;
