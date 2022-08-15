//import logo from './logo.svg';
import {
  HashRouter as Router,
  Route,
  Link,
  Redirect,
  Routes,
  Navigate
} from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { useEffect } from "react";

import './App.css';
import AppNavHeader from "./Components/AppNavHeader.js";
import PlayerInfoPage from "./Pages/PlayerInfoPage.js";
import UnknownPage from "./Pages/UnknownPage";
import LoansPage from "./Pages/LoansPage";
import ShipListPage from "./Pages/ShipListPage";
import ShipDetailPage from "./Pages/ShipDetailPage";
import ShipMarketPage from "./Pages/ShipMarketPage";
import LoginWrapper from "./Components/LoginWrapper";
import ContextContainer from "./ContextContainer";
import LogoutPage from "./Pages/LogoutPage";
import AllSystemsPage from "./Pages/AllSystemsPage";
import LocationPage from "./Pages/LocationPage";
import MarketPage from "./Pages/MarketPage";
import WikiPage from "./Pages/WikiPage";
import DevToolsPage from "./Pages/DevToolsPage";
import MyErrorBoundary from "./Components/MyErrorBoundary";

function App() {
  useEffect(() => {
    toast("Starting");
  }, []);

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestonTop={false}
        pauseOnFocusLoss
        pauseOnHover
        draggable
      />
      <ContextContainer>
        <MyErrorBoundary>
          <Router>
            <AppNavHeader />
            <div className="container-md">
              <div className="col">
                <MyErrorBoundary>
                  <LoginWrapper>
                    <Routes>
                      <Route index element={<Navigate to="/player" />} />
                      <Route path="/player" element={<PlayerInfoPage />}>

                      </Route>
                      <Route path="/loans" element={<LoansPage />}>

                      </Route>

                      <Route path="/market" element={<MarketPage />} />
                      <Route path="/wiki" element={<WikiPage />} />
                      <Route path="/devtools" element={<DevToolsPage />} />
                      <Route path="/ship" element={<ShipListPage />}>

                      </Route>
                      <Route path="/ship/:shipId" element={<ShipDetailPage />} />

                      <Route path="/shipmarket" element={<ShipMarketPage />} />

                      <Route path="/logout" element={<LogoutPage />} />

                      <Route path="/systems" element={<AllSystemsPage />} />

                      <Route path="/location/:locationid" element={<LocationPage />} />

                      <Route path="*" element={<UnknownPage />}>
                      </Route>
                    </Routes>

                  </LoginWrapper>
                </MyErrorBoundary>

              </div>
            </div>

          </Router>
        </MyErrorBoundary>
      </ContextContainer>



    </div>
  );
}

export default App;
