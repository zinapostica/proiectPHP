import React from "react";
import NavBar from "../NabBar/NavBar";
import { Container, Typography } from "@material-ui/core";

export default function Page(props) {
  return (
    <React.Fragment>
      <NavBar />
      <Container
        style={{
          backgroundColor: "#cfe8fc",
          marginTop: "8vh",
          minHeight: "100vh",
          paddingTop: "25px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography component="div">{props.content}</Typography>
      </Container>
    </React.Fragment>
  );
}
