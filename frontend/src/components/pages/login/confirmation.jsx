import React from "react";
import loginImg from "../../../utils/login.svg";
import { Link } from "react-router-dom";
import axios from "axios";

export class Confirmation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <div className="login">
          <div className="container">
            <div className="base-container" ref={this.props.containerRef}>
              <div className="header">Register Confirmation</div>
              <div className="content">
                <div className="image">
                  <img src={loginImg} />
                </div>
                <div className="form">
                  <h3>
                    Congratulations! You successfully registered to AskIT. Please check
                    your email to confirm it :)
                  </h3>
                </div>
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
