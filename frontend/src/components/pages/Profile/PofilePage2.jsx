import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Typography, Avatar, CircularProgress, Paper } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import NavBar from "../../NabBar/NavBar";
import axios from "axios";
import PostList from "../../Post/PostList";
import QuestionList from "../../Question/QuestionList";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    "aria-controls": `action-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  panels: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    position: "relative",
    minHeight: 200,
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    borderRadius: "0px 0px 20px 20px",
    backgroundColor: "#cfe8fc",
  },
  large: {
    margin: theme.spacing(1),
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  root: {
    marginTop: "8vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  userInfo: {
    color: "blue",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: "20px 20px 0px 0px",
    width: "100%",
    backgroundColor: "#cfe8fc",
    color: "#3f50b5",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  },
}));

export default function ProfilePage2(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [state, setState] = useState({
    selected: "",
    posts: [],
    questions: [],
    fetched: false,
  });
  const fetchData = async () => {
    const response = await axios.get("/api/userPosts", {
      params: {
        userID: props.match.params.id,
      },
    });
    const response2 = await axios.get("/api/userQuestions", {
      params: {
        userID: props.match.params.id,
      },
    });
    setState({
      ...state,
      questions: response2.data.questions,
      posts: response.data.posts,
      selected: "Posts",
      fetched: true,
    });
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <NavBar />
      <div style={{ width: "45vw", minWidth: "60vw" }}>
        <div className={classes.userInfo}>
          <Avatar className={classes.large}>
            {props.match.params.name[0]}
          </Avatar>
          <Typography gutterBottom variant="h5" component="h2">
            {props.match.params.name}
          </Typography>
        </div>
        <div className={classes.panels}>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="action tabs example"
            >
              <Tab label="Posts" {...a11yProps(0)} />
              <Tab label="Questions" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
            style={{
              minHeight: "71vh",
            }}
          >
            <TabPanel
              value={value}
              index={0}
              dir={theme.direction}
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                backgroundColor: "#cfe8fc",
              }}
            >
              {state.fetched ? (
                state.posts.length ? (
                  <PostList posts={state.posts} />
                ) : (
                  "User hasn't posted anything yet"
                )
              ) : (
                <CircularProgress />
              )}
            </TabPanel>
            <TabPanel
              value={value}
              index={1}
              dir={theme.direction}
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                backgroundColor: "#cfe8fc",
              }}
            >
              {state.fetched ? (
                state.questions.length ? (
                  <QuestionList questions={state.questions} />
                ) : (
                  "User hasn't asked any questions yet"
                )
              ) : (
                <CircularProgress />
              )}
            </TabPanel>
          </SwipeableViews>
        </div>
      </div>
    </div>
  );
}
