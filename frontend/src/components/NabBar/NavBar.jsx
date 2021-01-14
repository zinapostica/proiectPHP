import React, { useContext } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import userContext from "../../context/userContext";
import { useHistory } from "react-router-dom";
import PostAddIcon from "@material-ui/icons/PostAdd";
import AddPost from "../Post/AddPost";
import AddQuestion from "../Question/AddQuestion";
import SideBar from "./SideBar";
import SettingsIcon from "@material-ui/icons/Settings";
import Settings from "../Settings";
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    position: "fixed",
    top: "0px",
    width: "100vw",
    zIndex: "100",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: "25vw",
    marginRight: "25vw",
    width: "100%",
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      justifyContent: "center",
    },
  },
}));

export default function NavBar() {
  let history = useHistory();
  const context = useContext(userContext);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [anchorEl3, setAnchorEl3] = React.useState(null);
  const [isAddPostOpen, setIsAddPostOpen] = React.useState(false);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = React.useState(false);
  const isMenuOpen = Boolean(anchorEl);
  const isAddMenuOpen = Boolean(anchorEl2);
  const isDrawerOpen = Boolean(anchorEl3);

  const handleAddPostOpen = () => {
    setIsAddPostOpen(true);
    handleAddClose();
  };

  const handleAddPostClose = (value) => {
    setIsAddPostOpen(false);
  };

  const handleAddQuestionOpen = () => {
    setIsAddQuestionOpen(true);
    handleAddClose();
  };

  const handleAddQuestionClose = (value) => {
    setIsAddQuestionOpen(false);
  };
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddOpen = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleAddClose = () => {
    setAnchorEl2(null);
  };
  const handleDrawerOpen = (event) => {
    setAnchorEl3(event.currentTarget);
  };

  const handleDrawerClose = () => {
    setAnchorEl3(null);
  };

  const handleSettingsOpen = () => {
    context.update({ areSettingsOpen: true });
  };
  const handleSettingsClose = () => {
    context.update({ areSettingsOpen: false });
  };

  const signOut = () => {
    context.init();
    window.sessionStorage.removeItem("token");
  };

  const search = async (event) => {
    let str = event.target.value;
    if (event.keyCode == 13 && str && str.replace(/\s/g, "").length) {
      history.push("/search/" + event.target.value);
    }
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          history.push("/user/" + context.user.id + "/" + context.user.name);
          handleMenuClose();
        }}
      >
        Profile
      </MenuItem>
      <MenuItem onClick={signOut}>Sign out</MenuItem>
    </Menu>
  );
  const renderAddMenu = (
    <Menu
      anchorEl={anchorEl2}
      keepMounted
      open={isAddMenuOpen}
      onClose={handleAddClose}
    >
      <MenuItem onClick={handleAddPostOpen}>Add Post</MenuItem>
      <MenuItem onClick={handleAddQuestionOpen}>Add Question</MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar className={classes.rootContainer}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <h3
            style={{ cursor: "pointer" }}
            onClick={() => {
              history.push("/");
            }}
          >
            AskIT
          </h3>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              onKeyDown={search}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              aria-label="settings"
              color="inherit"
              onClick={handleSettingsOpen}
            >
              <SettingsIcon />
            </IconButton>
            <IconButton
              aria-label="add button"
              color="inherit"
              onClick={handleAddOpen}
            >
              <PostAddIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <AddPost
        categories={context.categories}
        open={isAddPostOpen}
        onClose={handleAddPostClose}
      />
      <Settings
        open={context.areSettingsOpen}
        onClose={handleSettingsClose}
        categories={context.categories}
      />
      <AddQuestion
        categories={context.categories}
        open={isAddQuestionOpen}
        onClose={handleAddQuestionClose}
      />
      <SideBar
        open={isDrawerOpen}
        anchorEl={anchorEl3}
        onClose={handleDrawerClose}
        categories={context.user.categories}
      />
      {renderAddMenu}
      {renderMenu}
    </div>
  );
}
