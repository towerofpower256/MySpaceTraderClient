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
import AccountPage from "./Components/Account/AccountPage.js";
import UnknownPage from "./Components/Common/UnknownPage";

function App() {
  return (
    <div className="App">
      <Router>
        <AppNavHeader />

        <Switch>
          <Redirect exact from='/' to='/account'/>
          <Route path="/account">
            <AccountPage />
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
