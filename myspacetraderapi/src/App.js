//import logo from './logo.svg';
import {
  HashRouter as Router,
  Route,
  Link,
  Redirect,
  Routes,
  Navigate
} from "react-router-dom";

import './App.css';
import AppNavHeader from "./Components/Common/AppHeader.js";
import PlayerInfoPage from "./Components/Player/PlayerInfoPage.js";
import UnknownPage from "./Components/Common/UnknownPage";
import LoansPage from "./Components/Loans/LoansPage";
import ShipListPage from "./Components/Ship/ShipListPage";
import ShipDetailPage from "./Components/Ship/ShipDetailPage";
import ShipMarketPage from "./Components/Ship/ShipMarketPage";

function App() {
  return (
    <div className="App">
      <Router>
        <AppNavHeader />
        <div className="container-md">
          <div className="col">
            <Routes>
              <Route index element={<Navigate to="/player" />} />
              <Route path="/player" element={<PlayerInfoPage />}>

              </Route>
              <Route path="/loans" element={<LoansPage />}>

              </Route>

              <Route path="/ship" element={<ShipListPage />}>
                
              </Route>
              <Route path="/ship/:shipId" element={<ShipDetailPage />} />

              <Route path="/shipmarket" element={<ShipMarketPage />} />

              <Route path="*" element={<UnknownPage />}>

              </Route>
            </Routes>
          </div>
        </div>

      </Router>


    </div>
  );
}

export default App;
