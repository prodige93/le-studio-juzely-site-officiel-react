import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/header";
import Orders from "./components/my.orders.home/my.orders.home";
import SizeChart from "./components/size-chart/SizeChart";

function App() {
  return (
    <Router>
      <div className="page-container">
        <div className="App">
          <header className="App-header">
            <Header />
          </header>
          <div className="App-orders">
            <Routes>
              <Route path="/" element={<Orders />} />
              <Route path="/size-chart" element={<SizeChart />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
