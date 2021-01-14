import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import NavBar from "../../NabBar/NavBar";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import PostList from "../../Post/PostList";
import Chart from "../../Chart";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#cfe8fc",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    borderRadius: "20px 20px 20px 20px",
    marginTop: "8vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    flexWrap: "wrap",
    minWidth: "60vw",
    minHeight: "70wh",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(70),
    },
  },
}));

export default function Dashboard() {
  const [postData, setPostData] = useState({ labels: [], data: [] });
  const [questionData, setQuestionData] = useState({ labels: [], data: [] });
  const fetchPostData = async () => {
    const response = await axios.get("/api/getPostCountByCategory");
    if (response.data.status === "success") {
      setPostData({
        labels: response.data.categories.map((val) => val.categoryName),
        data: response.data.categories.map((val) => val.count),
      });
    }
  };
  const fetchQuestionData = async () => {
    const response = await axios.get("/api/getQuestionCountByCategory");
    if (response.data.status === "success") {
      setQuestionData({
        labels: response.data.categories.map((val) => val.categoryName),
        data: response.data.categories.map((val) => val.count),
      });
    }
  };

  const classes = useStyles();
  useEffect(() => {
    fetchPostData();
    fetchQuestionData();
  }, []);

  return (
    <React.Fragment>
      <NavBar />
      <Container
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography component="div">
          <div className={classes.root}>
            <Chart
              title="Post count by category"
              labels={postData.labels}
              data={postData.data}
            />
            <Chart
              title="Question count by category"
              labels={questionData.labels}
              data={questionData.data}
            />
          </div>
        </Typography>
      </Container>
    </React.Fragment>
  );
}
