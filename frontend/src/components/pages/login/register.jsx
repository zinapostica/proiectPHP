import React from "react";
import axios from "axios";
import Categories from "../../Categories";
import UserContext from "../../../context/userContext";
import { withRouter, Link } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: "",
      checked: [],
    };
  }
  static contextType = UserContext;

  setChecked = (value) => {
    this.setState({ checked: value });
  };
  submitHandler = async (e) => {
    if (
      this.name &&
      this.email &&
      this.password &&
      this.password_confirmation &&
      this.state.checked.length
    ) {
      this.setState({ errors: <CircularProgress /> });
      const formData = {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation,
        categoryIDs: this.state.checked.map((val) => val.id),
      };
      console.log(formData);
      try {
        const response = await axios.post("api/register", formData);
        if (response.data.status == "success") {
          this.props.history.push("/confirmation");
        } else {
          this.setState({
            errors: "Error at registering",
          });
        }
      } catch (err) {
        console.log(err);
        this.setState({
          errors: "Error at registering",
        });
      }
    } else {
      this.setState({
        errors: "Fields should not be empty",
      });
    }
  };
  render() {
    console.log(this.state.checked);
    return (
      <div className="App">
        <div className="login">
          <div className="container">
            <div className="base-container" ref={this.props.containerRef}>
              <div className="header">Register</div>
              <div className="content">
                <div className="form">
                  <div className="error">{this.state.errors}</div>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      onChange={(e) => (this.name = e.target.value)}
                      type="text"
                      name="name"
                      placeholder="name"
                    />
                  </div>
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
                  <div className="form-group">
                    <label htmlFor="password">Confirm Password</label>
                    <input
                      onChange={(e) =>
                        (this.password_confirmation = e.target.value)
                      }
                      type="password"
                      name="password"
                      placeholder="confirm password"
                    />
                  </div>

                  <div className="form-group">
                    <Categories
                      title="Choose the categories you are interested in"
                      key={this.props.categories}
                      categories={this.props.categories}
                      checked={this.state.checked}
                      setChecked={this.setChecked}
                    />
                  </div>
                </div>
              </div>
              <div className="footer">
                <button
                  onClick={this.submitHandler}
                  type="button"
                  className="btn"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
          <Link to="/" className="left">
            <div className="inner-container">
              <div className="text">Login</div>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}
export default withRouter(Register);
