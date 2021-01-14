import React from "react";
import loginImg from "../../../utils/login.svg";
import { Link } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router-dom";
export class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: "",
      email: "",
      password: "",
      password_confirmation: ""
    };
  }
  submitHandler = async (e) => {
    const formData = {
      email: this.state.email,
      token: this.props.match.params.id,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation,
    };
    console.log(formData);
    try {
      const response = await axios.post("api/password/reset", formData);
      const data = response.data;
      console.log(data);
      this.setState(
        {
            errors: data.message,
            email: "",
            password: "",
            password_confirmation: ""
          }
      )
    } catch (err) {
      this.setState({
        errors: "Invalid data",
      });
    }
  };
  render() {
    return (
      <div className="App">
        <div className="login">
          <div className="container">
            <div className="base-container" ref={this.props.containerRef}>
              <div className="header">Reset Password</div>
              <div className="content">
                <div className="image">
                  <img src={loginImg} />
                </div>
                <div className="form">
                  <div className="error">{this.state.errors}</div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      onChange={(e) => (this.setState({
                        email: e.target.value,
                      }))}
                      type="email"
                      value={this.state.email}
                      name="email"
                      placeholder="email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input
                      onChange={(e) => (this.setState({
                        password: e.target.value,
                      }))}
                      type="password"
                      name="password"
                      value={this.state.password}
                      placeholder="password"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Confirm Password</label>
                    <input
                      onChange={(e) => (this.setState({
                        password_confirmation: e.target.value,
                      }))}
                      type="password"
                      name="password"
                      value={this.state.password_confirmation}
                      placeholder="confirm password"
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
                  Submit
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
