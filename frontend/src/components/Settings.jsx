import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import {
  TableBody,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  CircularProgress,
} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/Edit";
import userContext from "../context/userContext";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import SettingsIcon from "@material-ui/icons/Settings";
import Categories from "./Categories";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function Settings(props) {
  const context = useContext(userContext);
  const classes = useStyles();
  const [state, setState] = useState({
    name: false,
    email: false,
    categories: false,
    progress: false,
  });
  const [name, setName] = useState(context.user.name);
  const [email, setEmail] = useState(context.user.email);
  const [checked, setChecked] = React.useState([]);
  const setChecked2 = (value) => {
    setChecked(value);
  };
  const setEditMode = (key) => {
    switch (key) {
      case "Name":
        setState({ name: !state.name });
        break;
      case "Email":
        setState({ email: !state.email });
        break;
      case "Categories":
        setState({ categories: !state.categories });
        break;
    }
  };
  const editEmail = async () => {
    if (email && email != context.user.email) {
      setState({ ...state, progress: true });
      const response = await axios.post("/api/changeUserEmail", {
        userID: context.user.id,
        email: email,
      });
      console.log(response);
      if (response.data.status == "success") {
        context.update({ user: { ...context.user, email: email } });
        setEditMode("Email");
      }
      setState({ ...state, progress: false });
    }
  };
  const editName = async () => {
    if (name && name != context.user.name) {
      setState({ ...state, progress: true });
      const response = await axios.post("/api/changeUserName", {
        userID: context.user.id,
        name: name,
      });
      console.log(response);
      if (response.data.status == "success") {
        context.update({ user: { ...context.user, name: name } });
        setEditMode("Name");
      }
      setState({ ...state, progress: false });
    }
  };

  const editCategories = async () => {
    if (checked) {
      setState({ ...state, progress: true });
      const response = await axios.post("/api/updateUserCategories", {
        categoryIDs: checked.map((val) => val.id),
      });
      console.log(response);
      if (response.data.status == "success") {
        context.update({ user: { ...context.user, categories: checked } });
        setEditMode("Categories");
      }
      setState({ ...state, progress: false });
    }
  };
  console.log("context" + context.user);
  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      fullWidth={true}
      maxWidth={"md"}
    >
      <DialogTitle>
        {state.progress ? <CircularProgress size="1.5em" /> : <SettingsIcon />}
        <p>Settings</p>
      </DialogTitle>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                {state.name ? (
                  <TextField
                    label="Name"
                    id="nameTF"
                    defaultValue={context.user.name}
                    variant="outlined"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                ) : (
                  "Name"
                )}
              </TableCell>
              <TableCell>
                {state.name ? (
                  <Button onClick={editName}>Save</Button>
                ) : (
                  context.user.name
                )}
              </TableCell>
              <TableCell align="right">
                {state.name ? (
                  <IconButton
                    onClick={() => {
                      setState({ name: false });
                      setName(context.user.email);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      setEditMode("Name");
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" scope="row">
                {state.email ? (
                  <TextField
                    label="Email"
                    defaultValue={context.user.name}
                    value={email}
                    variant="outlined"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                ) : (
                  "Email"
                )}
              </TableCell>
              <TableCell>
                {state.email ? (
                  <Button onClick={editEmail}>Save</Button>
                ) : (
                  context.user.email
                )}
              </TableCell>
              <TableCell align="right">
                {state.email ? (
                  <IconButton
                    onClick={() => {
                      setState({ email: false });
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      setEditMode("Email");
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" scope="row">
                Categories
              </TableCell>
              <TableCell>
                {context.user.categories
                  ? context.user.categories.map(
                      (category, index) =>
                        category.categoryName +
                        (context.user.categories.length - 1 === index
                          ? " "
                          : ", ")
                    )
                  : "No categories"}
              </TableCell>
              <TableCell align="right">
                {state.categories ? (
                  <Button onClick={editCategories}>Save</Button>
                ) : (
                  <IconButton
                    onClick={() => {
                      setEditMode("Categories");
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>

            {state.categories ? (
              <Categories
                categories={props.categories}
                title="All Categories"
                setChecked={setChecked2}
                checked={checked}
              />
            ) : (
              ""
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  );
}
