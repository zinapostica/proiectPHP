import React from "react";
import PostList from "./Post/PostList";
import QuestionList from "./Question/QuestionList";
import { makeStyles } from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  flexItem: {
    minWidth: "50%",
  },
}));
export default function PostsAndQuestuionsList(props) {
  const classes = useStyles();
console.log(props.posts);
  return (
    <div className={classes.root}>
      <div className={classes.flexItem}>
        <h4>Posts:</h4>
        <Divider />
        <PostList posts={props.posts} />
      </div>
      <div className={classes.flexItem}>
        <h4>Questions:</h4>
        <Divider />
        <QuestionList questions={props.questions} />
      </div>
    </div>
  );
}
