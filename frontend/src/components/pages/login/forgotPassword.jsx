import React from "react";
import loginImg from "../../../utils/login.svg";
import { Link } from "react-router-dom";
import axios from "axios";
export class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: "",
      email: "",
    };
  }
  submitHandler = async (e) => {
    const formData = {
      email: this.state.email,
    };
    console.log(formData);
    try {
      const response = await axios.post("api/password/email", formData);
      const data = response.data;
      console.log(data);
      this.setState({
        email: "",
        errors: "Email sent, please check your inbox."
      });
      console.log(this.state);
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
              <div className="header">Forgot Password</div>
              <div className="content">
                <div className="image">
                  <img src={loginImg} />
                </div>
                <div className="form">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      onChange={(e) =>
                        this.setState({
                          email: e.target.value
                        })
                      }
                      type="email"
                      name="email"
                      value={this.state.email}
                      placeholder="email"
                    />
                  </div>
                  <div className="error">{this.state.errors}</div>
                </div>
              </div>
              <div className="footer">
                <button
                  onClick={this.submitHandler}
                  type="button"
                  className="btn"
                >
                  Reset Password
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
