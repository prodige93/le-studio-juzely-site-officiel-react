import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [activeTab, setActiveTab] = useState(1);
  const navigate = useNavigate();

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };
  
  const handleStartDesignClick = () => {
    navigate("/Size");
  };
  
  const handleMyOrdersClick = () => {
    navigate("/");
  };
  /** DIV DU BOUTTON DRAFT 1 A ADD NEW COLLECTION */
  return (
    <div className="page-container">
      <div className="h5-orders">
        <h5 onClick={handleMyOrdersClick} style={{cursor: 'pointer'}}>My Orders</h5>
          <div className="button-bubble">
            <button className="button-chat">Chat</button>
            <button className="button-chat" onClick={handleStartDesignClick}>Start design</button>
            <button className="button-chat">Start new collection</button>
          </div>
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
            <button className="button-frame" onClick={handleStartDesignClick}>
              Start design
            </button>
            <button className="button-frame">
              Start new collection
            </button>
          </div>
        )}
        {activeTab === 2 && (
          <div className="tab-frame">
            <button className="button-frame" onClick={handleStartDesignClick}>
              Start design
            </button>
            <button className="button-frame">
              Start new collection
            </button>
          </div>
        )}
        {activeTab === 3 && (
          <div className="tab-frame">
            <button className="button-frame" onClick={handleStartDesignClick}>
              Start design
            </button>
            <button className="button-frame">
              Start new collection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
