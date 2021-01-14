import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import NavBar from "../NabBar/NavBar";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import PostsAndQuestionsList from "../PostsAndQuestionsList";
import { Divider } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: "100%",
    display: "flex",
    justifyContent: "center",
  },
}));

export default function Dashboard(props) {
  const [state, setState] = useState({
    posts: [],
    questions: [],
    categoryID: "",
    success: false,
  });
  const fetchData = async () => {
    setState({
      posts: [],
      questions: [],
      categoryID: "",
      success: false,
    });
    console.log(props.match.params.id);
    const response = await axios.get("/api/getCategoryData", {
      params: { categoryID: props.match.params.id },
    });
    console.log(response.data.posts);
    if (response.data.status === "success") {
      setState({
        posts: response.data.posts,
        questions: response.data.questions,
        categoryID: props.match.params.id,
        success: true,
      });
    }
  };

  const classes = useStyles();
  useEffect(() => {
    fetchData();
  }, [props.match.params.id]);
  console.log(state);
  return (
    <React.Fragment>
      <NavBar />
      <Container>
        <Typography
          component="div"
          style={{
            backgroundColor: "#cfe8fc",
            paddingTop: "8vh",
            minHeight: "100vh",
            textAlign: "center",
            color: "#3f50b5",
          }}
        >
          <h3>{props.match.params.categoryName}</h3>
          <Divider />
          <div className={classes.root}>
            {state.posts.length > 0 || state.questions.length > 0 ? (
              <PostsAndQuestionsList
                posts={state.posts}
                questions={state.questions}
              />
            ) : state.success ? (
              <p>No data to display</p>
            ) : (
              <CircularProgress />
            )}
          </div>
        </Typography>
      </Container>
    </React.Fragment>
  );
}
