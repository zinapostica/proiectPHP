import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import { ListItem, ListItemIcon } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

export default function TemporaryDrawer(props) {
  let history = useHistory();
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const handleCategoryClick = (category) => {
    history.push("/category/" + category.id + "/" + category.categoryName);
    props.onClose();
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List key={props.categories}>
        <ListItem>
          <ListItemText primary="Categories:" />
        </ListItem>
        <Divider />
        {props.categories
          ? props.categories.map((value) => (
              <ListItem
                button
                key={value.id}
                onClick={() => {
                  handleCategoryClick(value);
                }}
              >
                <ListItemIcon>
                  <FiberManualRecordIcon />
                </ListItemIcon>
                <ListItemText primary={value.categoryName} />
              </ListItem>
            ))
          : ""}
      </List>
    </div>
  );

  return (
    <div>
      <Drawer anchor={props.anchor} open={props.open} onClose={props.onClose}>
        {list(props.categories)}
      </Drawer>
    </div>
  );
}
