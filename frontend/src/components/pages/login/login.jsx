import React from "react";
import loginImg from "../../../utils/login.svg";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";
import UserContext from "../../../context/userContext";
export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: "",
    };
  }
  static contextType = UserContext;
  fetchUserCategories = async () => {
    const response = await axios.get("/api/getUserCategories");
    if (response.data.status === "success") {
      console.log(response.data.categories);
      this.context.update({
        user: { ...this.context.user, categories: response.data.categories },
      });
    }
  };
  submitHandler = async (e) => {
    const formData = {
      email: this.email,
      password: this.password,
    };
    const response = await axios.post("api/login", formData);
    const data = response.data;
    console.log(data);

    if (data.status === "success") {
      window.sessionStorage.setItem("token", data.access_token);
      this.context.update({
        user: data.user,
        loggedIn: true,
        token: data.access_token,
      });
      console.log(this.context);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + data.access_token;
      this.fetchUserCategories();
      this.props.history.push("/");
    } else {
      this.setState({
        errors: data.message,
      });
    }
  };

  render() {
    return (
      <div className="App">
        <div className="login">
          <div className="container">
            <div className="base-container">
              <div className="header">Login</div>
              <div className="content">
                <div className="image">
                  <img src={loginImg} />
                </div>
                <div className="error">{this.state.errors}</div>
                <div className="form">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      onChange={(e) => (this.email = e.target.value)}
                      type="email"
                      name="email"
                      placeholder="email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      onChange={(e) => (this.password = e.target.value)}
                      type="password"
                      name="password"
                      placeholder="password"
                    />
                  </div>
                  <div className="forgotPassword">
                    <Link to="/forgotPassword">Forgot Password?</Link>
                  </div>
                </div>
              </div>
              <div className="footer">
                <button
                  onClick={this.submitHandler}
                  type="button"
                  className="btn"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
          <Link to="/register" className="right">
            <div className="inner-container">
              <div className="text">Register</div>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}
export default withRouter(Login);
