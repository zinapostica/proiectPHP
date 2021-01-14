import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, CircularProgress, Typography } from "@material-ui/core";
import UserContext from "../../../context/userContext";
import background from "../../../assets/img/sign.jpg";
import ButtonBase from "@material-ui/core/ButtonBase";
import axios from "axios";
import PostList from "../../Post/PostList";
import QuestionList from "../../Question/QuestionList";
import NavBar from "../../NabBar/NavBar";
const useStyles = makeStyles((theme) => ({
  list: {
    backgroundImage: `url(${background})`,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    flexWrap: "wrap",
    minHeight: "80vh",
    "& > *": {
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(6),
      marginRight: theme.spacing(6),
      width: "90%",
    },
  },
  userInfo: {
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  large: {
    margin: theme.spacing(2),
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
    minWidth: 300,
    width: "100%",
  },
  image: {
    position: "relative",
    height: 100,
    [theme.breakpoints.down("xs")]: {
      width: "100% !important", // Overrides inline-style
      height: 100,
    },
    "&:hover, &$focusVisible": {
      zIndex: 1,
      "& $imageBackdrop": {
        opacity: 0.15,
      },
      "& $imageMarked": {
        opacity: 0,
      },
      "& $imageTitle": {
        border: "4px solid currentColor",
      },
    },
  },
  focusVisible: {},
  imageButton: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center 40%",
  },
  imageBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.25,
    transition: theme.transitions.create("opacity"),
  },
  imageTitle: {
    position: "relative",
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${
      theme.spacing(1) + 6
    }px`,
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: "absolute",
    bottom: -2,
    left: "calc(50% - 9px)",
    transition: theme.transitions.create("opacity"),
  },
}));

const images = [
  {
    title: "Posts",
    width: "33.33%",
  },
  {
    title: "Questions",
    width: "33.33%",
  },
  {
    title: "Settings",
    width: "33.33%",
  },
];

export default function ProfilePage(props) {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const [state, setState] = useState({
    selected: "Posts",
    posts: [],
    questions: [],
  });

  const fetchPosts = async () => {
    const response = await axios.get("/api/userPosts", {
      params: {
        userID: userContext.user.id,
      },
    });
    const response2 = await axios.get("/api/userQuestions", {
      params: {
        userID: userContext.user.id,
      },
    });
    setState({
      ...state,
      questions: response2.data.questions,
      posts: response.data.posts,
      selected: "Posts",
    });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleButtonClick = (title) => {
    if (state.selected != title) {
      setState({ ...state, selected: title });
    }
  };

  const renderSwitch = () => {
    switch (state.selected) {
      case "Posts":
        return state.posts.length ? (
          <PostList posts={state.posts} />
        ) : (
          "No posts to display"
        );
      case "Questions":
        return <QuestionList questions={state.questions} />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "10vh",
      }}
    >
      <NavBar />
      <div style={{ width: "45vw", minWidth: "60vw" }}>
        <div
          className={classes.userInfo}
          style={{
            backgroundImage: `url(${background})`,
            borderRadius: "20px 20px 0px 0px",
            opacity: 0.8,
          }}
        >
          <Avatar className={classes.large}>{userContext.user.name[0]}</Avatar>
          <Typography gutterBottom variant="h5" component="h2">
            {userContext.user.name}
          </Typography>
        </div>

        <div className={classes.root}>
          {images.map((image) => (
            <ButtonBase
              focusRipple
              key={image.title}
              className={classes.image}
              focusVisibleClassName={classes.focusVisible}
              style={{
                width: image.width,
              }}
              onClick={() => {
                handleButtonClick(image.title);
              }}
            >
              <span className={classes.imageBackdrop} />
              <span className={classes.imageButton}>
                <Typography
                  component="span"
                  variant="subtitle1"
                  color="inherit"
                  className={classes.imageTitle}
                >
                  {image.title}
                  <span className={classes.imageMarked} />
                </Typography>
              </span>
            </ButtonBase>
          ))}
        </div>
        <div className={classes.list}></div>
      </div>
    </div>
  );
}
