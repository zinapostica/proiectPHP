import React from "react";
import "./App.scss";
import Login from "./components/pages/login/login";
import {
  Confirmation,
  ForgotPassword,
  ResetPassword,
} from "./components/pages/login/index";
import Register from "./components/pages/login/register";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import UserContext from "./context/userContext";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import ProfilePage2 from "./components/pages/Profile/PofilePage2";
import ProfilePage from "./components/pages/Profile/ProfilePage";
import CategoryPage from "./components/pages/CategoryPage";
import SearchResultPage from "./components/pages/SearchResultPage";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.updateState = this.updateState.bind(this);
    this.state = {
      user: {
        email: "",
        id: "",
        isAdmin: 0,
        name: "",
        profilePicture: null,
        categories: [],
      },
      loggedIn: false,
      update: this.updateState,
      init: this.initState,
      categories: [],
      areSettingsOpen: false,
    };
  }
  componentDidMount() {
    this.fetchCategories();
    this.checkLogin();
    this.fetchUserCategories();
  }
  initState = () => {
    this.setState({
      user: {
        email: "",
        id: "",
        isAdmin: 0,
        name: "",
        profilePicture: null,
        categories: [],
      },
      loggedIn: false,
      update: this.updateState,
      init: this.initState,
      categories: [],
      areSettingsOpen: false,
    });
  };

  static contextType = UserContext;
  checkLogin() {
    const token = window.sessionStorage.getItem("token");
    document.title = "AskIT";
    console.log(token);
    const checkToken = async (token) => {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      const response = await axios.post("api/checkToken", { token: token });
      if (response.data.status == "success") {
        this.setState({
          loggedIn: true,
          user: response.data.user,
        });

        
        return true;
      } else {
        return false;
      }
    };
    if (token !== null) {
      const isValid = checkToken(token);
      if (isValid == false) {
        window.localStorage.removeItem("token");
        window.sessionStorage.removeItem("token");
      }
    }
  }

  updateState = (values) => {
    this.setState(values);
  };
  routePrivately = (component) => {
    return this.state.loggedIn ? (
      component
    ) : window.sessionStorage.getItem("token") ? (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    ) : (
      <Login />
    );
  };

  fetchCategories = async () => {
    const response = await axios.get("/api/getCategories");
    if (response.data.status === "success") {
      console.log(response.data.categories);
      this.setState({ categories: response.data.categories });
    }
  };

  fetchUserCategories = async () => {
    const response = await axios.get("/api/getUserCategories");
    if (response.data.status === "success") {
      console.log(response.data.categories);
      this.setState({
        user: { ...this.state.user, categories: response.data.categories },
      });
    }
  };

  render() {
    return (
      <UserContext.Provider
        value={this.state}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path="/"
              component={() => this.routePrivately(<Dashboard />)}
            />
            <Route path="/register">
              <Register categories={this.state.categories} />
            </Route>
            <Route path="/confirmation" component={Confirmation} />
            <Route path="/forgotPassword" component={ForgotPassword} />
            <Route path="/resetPassword/:id" component={ResetPassword} />
            <Route
              path="/profile"
              component={() => this.routePrivately(<ProfilePage />)}
            />
            <Route
              path="/category/:id/:categoryName"
              component={(props) =>
                this.routePrivately(<CategoryPage {...props} />)
              }
            />
            <Route
              path="/search/:key"
              component={(props) =>
                this.routePrivately(<SearchResultPage {...props} />)
              }
            />
            <Route
              path="/user/:id/:name"
              component={(props) =>
                this.routePrivately(<ProfilePage2 {...props} />)
              }
            />
          </Switch>
        </BrowserRouter>
      </UserContext.Provider>
    );
  }
}

export default App;
