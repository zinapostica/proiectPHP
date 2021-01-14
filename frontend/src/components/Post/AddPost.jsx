import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import {
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@material-ui/core";
import PostAddIcon from "@material-ui/icons/PostAdd";
import axios from "axios";
import Categories from "../Categories";

export default function AddPost(props) {
  const { onClose, selectedValue, open } = props;
  const [checked, setChecked] = React.useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(false);
  const addPost = async () => {
    if (body && title) {
      setProgress(true);
      const data = {
        title: title,
        body: body,
        categoryIDs: checked.map((value) => {
          return value.id;
        }),
      };
      const response = await axios.post("/api/addPost", data);
      if (response.data.status == "success") {
        setMessage("Post successfully saved");
        setChecked([]);
        setTitle("");
        setBody("");
      } else {
        setMessage("Could not save Post");
      }
      setProgress(false);
    } else {
      setMessage("Body and title should not be empty");
    }
  };
  const setChecked2 = (value) => {
    setChecked(value);
  };
  const handleClose = () => {
    setMessage("");
    onClose(selectedValue);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      fullWidth={true}
      maxWidth={"sm"}
    >
      <DialogTitle id="simple-dialog-title">
        {progress ? <CircularProgress size="1.5rem" /> : <PostAddIcon />}
        Add Post
      </DialogTitle>

      <DialogContent>
        <TextField
          style={{ marginBottom: "10px" }}
          id="titlefield"
          label="Title"
          variant="outlined"
          value={title}
          fullWidth={true}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <TextField
          style={{ marginBottom: "10px" }}
          id="bodyfield"
          label="Body"
          variant="outlined"
          value={body}
          fullWidth={true}
          multiline
          onChange={(event) => {
            setBody(event.target.value);
          }}
        />
        <Categories
          categories={props.categories}
          title="All Categories"
          setChecked={setChecked2}
          checked={checked}
        />
        {message}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={addPost} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
