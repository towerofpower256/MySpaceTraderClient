//import logo from './logo.svg';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import './App.css';
import AppNavHeader from "./Components/Common/AppHeader.js";
import PlayerInfoPage from "./Components/Player/PlayerInfoPage.js";
import UnknownPage from "./Components/Common/UnknownPage";
import LoansPage from "./Components/Loans/LoansPage";

function App() {
  return (
    <div className="App">
      <Router>
        <AppNavHeader />

        <Switch>
          <Redirect exact from='/' to='/player'/>
          <Route path="/player">
            <PlayerInfoPage />
          </Route>
          <Route path="/loans">
            <LoansPage />
          </Route>
          <Route path="*">
            <UnknownPage />
          </Route>
        </Switch>
      </Router>


    </div>
  );
}

export default App;
