import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import Divider from "@material-ui/core/Divider";
import axios from "axios";
const styles = () => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  avatar: {
    backgroundColor: red[500],
  },
});

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: {
        body: "",
        userID: "",
        id: "",
        created_at: "",
        updated_at: "",
        name: " ",
        ratingValue: "",
        isLiked: false,
        likes: 0,
      },
      anchorEl2: null,
    };
    this.localDate = moment.utc(this.props.comment.created_at).local();
    this.formatedDate = this.localDate.calendar();
  }
  componentDidMount() {
    this.setState({ comment: this.props.comment });
  }
  likeComment = async () => {
    if (this.state.comment.isLiked) {
      const response = await axios.post("/api/deleteCommentLike", {
        commentID: this.props.comment.id,
      });
      if (response.data.status == "success") {
        this.setState({
          comment: {
            ...this.state.comment,
            isLiked: false,
            likes: this.state.comment.likes - 1,
          },
        });
      }
    } else {
      const response = await axios.post("/api/voteAnswer", {
        commentID: this.props.comment.id,
      });
      if (response.data.status == "success") {
        this.setState({
          comment: {
            ...this.state.comment,
            isLiked: true,
            likes: this.state.comment.likes + 1,
          },
        });
      }
    }
  };

  render() {
    const classes = this.props;
    return (
      <Card className={classes.root}>
        <CardHeader
          style={{ backgroundColor: "	#F5F5F5" }}
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {this.state.comment.name ? this.state.comment.name[0] : ""}
            </Avatar>
          }
          action={
            <IconButton
              aria-label="delete"
              onClick={() => {
                this.props.deleteComment(this.state.comment);
              }}
            >
              <DeleteIcon />
            </IconButton>
          }
          title={this.state.comment.name}
          subheader={this.formatedDate}
        />
        <CardContent style={{ backgroundColor: "	#F5F5F5" }}>
          <Typography variant="body2" color="textSecondary" component="p">
            {this.state.comment.body}
          </Typography>
        </CardContent>
        <CardActions disableSpacing style={{ backgroundColor: "	#F5F5F5" }}>
          <IconButton aria-label="like comment" onClick={this.likeComment}>
            <FavoriteIcon
              style={this.state.comment.isLiked ? { color: "#ff3d47" } : {}}
            />
          </IconButton>
          <IconButton aria-label="rating" style={{ fontSize: "0.8rem" }}>
            {this.state.comment.likes}
          </IconButton>
        </CardActions>
        <Divider />
      </Card>
    );
  }
}
export default withStyles(styles)(Comment);
