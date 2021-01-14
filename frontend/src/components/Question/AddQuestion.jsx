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

export default function AddQuestion(props) {
  const { onClose, selectedValue, open } = props;
  const [checked, setChecked] = React.useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(false);

  const addQuestion = async () => {
    setMessage("");
    if (title && checked) {
      setProgress(true);
      const data = {
        body: title,
        categoryIDs: checked.map((value) => {
          return value.id;
        }),
      };
      const response = await axios.post("/api/addQuestion", data);
      if (response.data.status == "success") {
        setTitle("");
        setChecked([]);
        setMessage("question successfully saved");
        
      } else {
        setMessage("Could not save question");
        //  props.onClose();
      }
      setProgress(false);
    }else{
      setMessage("Title should not be empty");
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
        Add Question
      </DialogTitle>

      <DialogContent>
        <TextField
          style={{ marginBottom: "10px" }}
          id="titlefield"
          label=" Question body"
          variant="outlined"
          multiline
          value={title}
          fullWidth={true}
          onChange={(event) => {
            setTitle(event.target.value);
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
        <Button onClick={addQuestion} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
