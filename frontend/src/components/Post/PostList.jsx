import React, { useState, useEffect } from "react";
import Post from "./Post";
import axios from "axios";
import { List, ListItem } from "@material-ui/core";
export default function PostList(props) {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    setPosts(props.posts);
  });

  const deletePost = async (post) => {
    const response = await axios.delete("/api/deletePost", {
      data: { postID: post.id },
    });
    if (response.data.status == "success") {
      const index = posts.indexOf(post);
      console.log(index);
      if (index > -1) {
        setPosts(posts.splice(index, 1));
      }
    }
  };
  let renderPosts;
  console.log(posts);
  if (posts) {
    renderPosts = posts.map((val, index) => {
      return (
        <ListItem alignItems="flex-start" key={index}>
          <Post post={val} deletePost={deletePost} />
        </ListItem>
      );
    });
  } else {
    renderPosts = "No posts to display";
  }
  return <List>{renderPosts}</List>;
}
