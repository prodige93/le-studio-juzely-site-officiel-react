import { useState } from "react";

function Orders() {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };
  /** DIV DU BOUTTON DRAFT 1 A ADD NEW COLLECTION */
  return (
    <div className="page-container">
      <div className="h5-orders">
        <h5>My Orders</h5>
      </div>
      <div className="orders-tabs" data-active={activeTab}>
        <button
          className={`tab-button ${activeTab === 1 ? "active" : ""}`}
          onClick={() => handleTabClick(1)}
        >
          Drafts 
        </button>
        <button
          className={`tab-button ${activeTab === 2 ? "active" : ""}`}
          onClick={() => handleTabClick(2)}
        >
          Samples
        </button>
        <button
          className={`tab-button ${activeTab === 3 ? "active" : ""}`}
          onClick={() => handleTabClick(3)}
        >
          Bulks
        </button>
      </div>
      <div className="orders-content">
        {activeTab === 1 && (
          <div className="tab-frame">
            Contenu de la première tab
          </div>
        )}
        {activeTab === 2 && (
          <div className="tab-frame">
            Contenu de la deuxième tab
          </div>
        )}
        {activeTab === 3 && (
          <div className="tab-frame">
            <button className="button-frame">
              bibi
            </button>
            <button className="button-frame">
              bibi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
