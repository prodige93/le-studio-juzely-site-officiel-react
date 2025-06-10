import { useState } from 'react';

function Orders() {
    const [activeTab, setActiveTab] = useState(1);

    const handleTabClick = (tabIndex) => {
        setActiveTab(tabIndex);
    };

    return (
        <div className="page-container">
            <div className="h5-orders">
                <h5>My Orders</h5>
            </div>
            <div className="orders-tabs" data-active={activeTab}>
                <button 
                    className={`tab-button ${activeTab === 1 ? 'active' : ''}`}
                    onClick={() => handleTabClick(1)}
                >
                    Drafts
                </button>
                <button 
                    className={`tab-button ${activeTab === 2 ? 'active' : ''}`}
                    onClick={() => handleTabClick(2)}
                >
                    Samples
                </button>
                <button 
                    className={`tab-button ${activeTab === 3 ? 'active' : ''}`}
                    onClick={() => handleTabClick(3)}
                >
                    Bulks
                </button>
            </div>
        </div>
    )
}

export default Orders;