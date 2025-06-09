import "./App.css";
import Header from "./components/header/header";
import Orders from "./components/my.orders.home/my.orders.home";

function App() {
  return (
    <div className="page-container">
      <div className="App">
        <header className="App-header">
          <Header />
        </header> 
        <div className="App-orders">
          <Orders />
        </div>
      </div>
    </div>
  );
}

export default App;
