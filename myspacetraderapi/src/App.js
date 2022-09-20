//import logo from './logo.svg';
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { useEffect } from "react";

import './App.css';
import AppNavHeader from "./Layout/AppNavHeader.js";
import PlayerInfoPage from "./Pages/PlayerInfoPage.js";
import UnknownPage from "./Pages/UnknownPage";
import ShipMarketPage from "./Pages/ShipMarketPage";
import LoginWrapper from "./Components/LoginWrapper";
import ContextContainer from "./ContextContainer";
import LogoutPage from "./Pages/LogoutPage";
//import LocationPage from "./Pages/LocationPage";
import HelpPage from "./Pages/HelpPage";
import HelpTypesPage from "./Pages/HelpTypesPage";
import DevToolsPage from "./Pages/DevToolsPage";
import MyErrorBoundary from "./Layout/MyErrorBoundary";
//import SystemsPage from "./Pages/SystemsPage";
import MarketDashboardPage from "./Pages/MarketDashboardPage";
import MarketReportPage from "./Pages/MarketReportPage";
import MarketRouteFinderPage from "./Pages/MarketRouteFinder";
import HistoryPage from "./Pages/HistoryPage";
import setPageTitle from "./Utils/setPageTitle";
import CommandShipPage from "./Pages/CommandShipPage";
import GamePage from "./Pages/GamePage";
import humanizeString from "./Utils/humanizeString";
import LocationPage from "./Pages/LocationPage";
import NewStartSplash from "./Pages/NewStartSplash";
//import LocationsPage from "./Pages/LocationsPage";
//import MyBuggyComponent from "./Components/MyBuggyComponent";

function App() {
  useEffect(() => {
    //toast("Starting");
    //setPageTitle();
  }, []);

  return (
    <div className="App">
      <ToastContainer
        position="bottom-right"
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
              <div className="col text-start">
                <MyErrorBoundary>
                  <LoginWrapper>
                    <NewStartSplash />
                    <Routes>
                      <Route index element={<Navigate to="/game" />} />
                      
                      <Route path="/player" element={<PlayerInfoPage />} />
                      <Route path="/command" element={<CommandShipPage />} />
                      <Route path="/game" element={<GamePage />} />

                      <Route path="/market/" element={<MarketDashboardPage />} />
                      <Route path="/market/:systemid" element={<MarketDashboardPage />} />
                      <Route path="/market/report" element={<MarketReportPage />} />
                      <Route path="/market/finder" element={<MarketRouteFinderPage />} />
                      <Route path="/market/ship" element={<ShipMarketPage />} />
                      <Route path="/help" element={<HelpPage />} />
                      <Route path="/help/types" element={<HelpTypesPage />} />
                      <Route path="/devtools" element={<DevToolsPage />} />
                      
                      <Route path="/locations/:locationid" element={<LocationPage />} />

                      <Route path="/history" element={<HistoryPage />} />

                      <Route path="/logout" element={<LogoutPage />} />
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
