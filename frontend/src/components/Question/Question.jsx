import React from "react";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteIcon from "@material-ui/icons/Delete";
import CommentList from "./CommentList";
import TextField from "@material-ui/core/TextField";
import SendOutlinedIcon from "@material-ui/icons/SendOutlined";
import { Divider } from "@material-ui/core";
import CategoryList from "../Post/CategoryList";
const styles = () => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
});

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: {
        body: "",
        userID: "",
        id: "",
        created_at: "",
        updated_at: "",
        name: " ",
        comments: [],
        categories: [],
      },
      expanded: false,
      anchorEl2: null,
      newComment: "",
    };
    this.localDate = moment.utc(this.props.question.created_at).local();
    this.formatedDate = this.localDate.calendar();
  }
  componentDidMount() {
    this.setState({ question: this.props.question });
    console.log(this.props.question.name);
  }

  handleExpandClick = () => {
    this.setState((prevState) => {
      return { expanded: !prevState.expanded };
    });
  };

  handleMenuClick = (event) => {
    this.setState({ ...this.state, anchorEl2: event.currentTarget });
  };
  handleMenuClose = () => {
    this.setState({ ...this.state, anchorEl2: null });
  };
  handleAddComment = async () => {
    const response = await axios.post("/api/answerQuestion", {
      body: this.state.newComment,
      questionID: this.state.question.id,
    });
    console.log(response);
    if (response.data.status == "success") {
      if (!this.state.question.comments) {
        this.setState({
          newComment: "",
          question: {
            ...this.state.question,
            comments: [response.data.comment],
          },
        });
      } else {
        this.setState({
          newComment: "",
          question: {
            ...this.state.question,
            comments: [...this.state.question.comments, response.data.comment],
          },
        });
      }
    }
  };

  render() {
    const open = Boolean(this.state.anchorEl);
    const id = open ? "simple-popover" : undefined;
    const classes = this.props;
    return (
      <Card
        className={classes.root}
        style={{ width: "100%", maxWidth: "800px", minWidth: "550px" }}
      >
        <CardHeader
          avatar={
            <Avatar
              aria-label="avatar"
              className={classes.avatar}
              onClick={() => {
                this.props.history.push(
                  "/user/" + this.state.post.userID + "/" + this.state.post.name
                );
              }}
              style={{ cursor: "pointer" }}
            >
              {this.state.question.name ? this.state.question.name[0] : ""}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings" onClick={this.handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          }
          title={this.state.question.name}
          subheader={this.formatedDate}
        />
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl2}
          keepMounted
          open={Boolean(this.state.anchorEl2)}
          onClose={this.handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              this.props.deleteQuestion(this.state.question);
              this.handleMenuClose();
            }}
          >
            <DeleteIcon />
            Delete question
          </MenuItem>
        </Menu>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {this.state.question.body}
          </Typography>
        </CardContent>

        <CardActions disableSpacing>
          <Typography style={{ fontSize: "0.8rem" }}>
            {this.state.question.comments
              ? this.state.question.comments.length
              : "0"}{" "}
            Comments
          </Typography>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
          <CategoryList categories={this.state.question.categories} />
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <Divider />
          <CardContent>
            <TextField
              id="outlined-basic"
              label="Add Comment"
              variant="outlined"
              size="small"
              value={this.state.newComment}
              onChange={(event) => {
                this.setState({
                  ...this.state,
                  newComment: event.target.value,
                });
              }}
              fullWidth={true}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={this.handleAddComment}
                    aria-label="add comment"
                  >
                    <SendOutlinedIcon />
                  </IconButton>
                ),
              }}
            ></TextField>

            <CommentList comments={this.state.question.comments} />
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}
export default withStyles(styles)(Question);
