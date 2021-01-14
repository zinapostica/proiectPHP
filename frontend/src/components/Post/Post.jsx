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
import FavoriteIcon from "@material-ui/icons/Favorite";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import moment from "moment";
import Popover from "@material-ui/core/Popover";
import { withStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CategoryList from "./CategoryList";
import { withRouter } from "react-router-dom";

const StyledRating = withStyles({
  iconFilled: {
    color: "#ff3d47",
  },
  iconHover: {
    color: "#ff3d47",
  },
})(Rating);

const styles = (theme) => ({
  root: {
    width: "100%",
    maxWidth: "700px",
    border: "1px solid black",
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

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {
        body: "",
        title: "",
        userID: "",
        id: "",
        created_at: "",
        updated_at: "",
        name: " ",
        ratingValue: "",
        isRated: false,
        categories: [],
      },
      newTitle: "",
      newBody: "",
      expanded: false,
      anchorEl: null,
      anchorEl2: null,
      editMode: false,
    };
    this.localDate = moment.utc(this.props.post.created_at).local();
    this.formatedDate = this.localDate.calendar();
  }
  componentDidMount() {
    this.setState({
      post: this.props.post,
      newTitle: this.props.post.title,
      newBody: this.props.post.body,
    });
  }

  handleExpandClick = () => {
    this.setState((prevState) => {
      return { expanded: !prevState.expanded };
    });
  };
  handleClick = (event) => {
    this.setState({ ...this.state, anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ ...this.state, anchorEl: null });
  };
  handleMenuClick = (event) => {
    this.setState({ ...this.state, anchorEl2: event.currentTarget });
  };
  handleMenuClose = () => {
    this.setState({ ...this.state, anchorEl2: null });
  };

  ratepost = async (event, newValue) => {
    const res = await axios.get("/api/ratingValues");
    console.log(res.data);
    let valueID = 0;
    res.data.map((val, index) => {
      if (newValue === val.value) {
        valueID = val.id;
      }
    });
    const response = await axios.post("/api/ratePost", {
      postID: this.state.post.id,
      valueID: valueID,
    });
    if (response.data.status === "success") {
      const res2 = await axios.get("/api/postRating", {
        params: { postID: this.state.post.id },
      });
      console.log(res2.data.isRated, res2.data.ratingValue);
      this.setState({
        ...this.state,
        post: {
          ...this.state.post,
          isRated: res2.data.isRated,
          ratingValue: res2.data.ratingValue,
        },
      });
    }
    this.setState((prevState) => {
      return { anchorEl: null, open: !prevState.open };
    });
  };
  editPost = () => {
    this.handleMenuClose();
    this.setState(
      {
        expanded: true,
        editMode: true,
      },
      () => {
        console.log(this.state);
      }
    );
  };
  savePost = async () => {
    const response = await axios.post("api/editPost", {
      post: {
        ...this.state.post,
        body: this.state.newBody,
        title: this.state.newTitle,
      },
    });
    console.log(response.data);
    if ((response.data.status = "success")) {
      this.setState({
        editMode: false,
        post: {
          ...this.state.post,
          title: this.state.newTitle,
          body: this.state.newBody,
        },
      });
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
              aria-label="recipe"
              className={classes.avatar}
              onClick={() => {
                this.props.history.push("/user/" + this.state.post.userID+"/"+this.state.post.name);
              }}
              style={{ cursor: "pointer" }}
            ></Avatar>
          }
          action={
            <IconButton aria-label="settings" onClick={this.handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          }
          title={this.state.post.name}
          subheader={this.formatedDate}
        />
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl2}
          keepMounted
          open={Boolean(this.state.anchorEl2)}
          onClose={this.handleMenuClose}
        >
          <MenuItem onClick={this.editPost}>
            <EditIcon />
            Edit Post
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.props.deletePost(this.state.post);
              this.handleMenuClose();
            }}
          >
            <DeleteIcon />
            Delete post
          </MenuItem>
        </Menu>
        <CardContent>
          {this.state.editMode ? (
            <TextField
              value={this.state.newTitle}
              id="edit-title"
              label="Edit post title"
              fullWidth={true}
              onChange={(event) => {
                this.setState({ newTitle: event.target.value });
              }}
            />
          ) : (
            <Typography variant="body2" color="textSecondary" component="p">
              {this.state.post.title}
            </Typography>
          )}
        </CardContent>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            {!this.state.editMode ? (
              this.state.post.body
            ) : (
              <TextField
                multiline
                id="edit-body"
                label="Edit post body"
                value={this.state.newBody}
                fullWidth={true}
                onChange={(event) => {
                  this.setState({ newBody: event.target.value });
                }}
              />
            )}
          </CardContent>
        </Collapse>
        <CardActions disableSpacing>
          <IconButton aria-label="rate post" onClick={this.handleClick}>
            <FavoriteIcon
              style={this.state.post.isRated ? { color: "#ff3d47" } : {}}
            />
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={this.state.anchorEl}
            onClose={this.handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <StyledRating
              name="simple-controlled"
              icon={<FavoriteIcon fontSize="inherit" />}
              value={this.state.value}
              onChange={this.ratepost}
            />
          </Popover>
          <IconButton aria-label="rating" style={{ fontSize: "0.8rem" }}>
            {this.state.post.ratingValue}
          </IconButton>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            style={{ fontSize: "0.7rem" }}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="show more"
          >
            Content
            <ExpandMoreIcon />
          </IconButton>
          <CategoryList categories={this.state.post.categories} />
          {this.state.editMode ? (
            <Button variant="contained" onClick={this.savePost}>
              Save
            </Button>
          ) : (
            ""
          )}
        </CardActions>
      </Card>
    );
  }
}
export default withRouter(withStyles(styles)(Post));
