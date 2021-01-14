import React, { useState, useEffect } from "react";
import Comment from "./Comment";
import axios from "axios";

export default function CommentList(props) {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    let coms = props.comments;
    if (coms)
      coms.sort((a, b) =>
        a.likes === b.likes ? 0 : a.likes < b.likes ? 1 : -1
      );
    setComments(coms);
  });

  const deleteComment = async (comment) => {
    const response = await axios.delete("/api/deleteComment", {
      data: { commentID: comment.id },
    });
    console.log(response.data);
    if (response.data.status == "success") {
      const index = comments.indexOf(comment);
      console.log(index);
      if (index > -1) {
        setComments(comments.splice(index, 1));
      }
    }
  };
  let renderComments = [];
  if (comments)
    renderComments = comments.map((val, index) => {
      return (
        <Comment key={index} comment={val} deleteComment={deleteComment} />
      );
    });
  return <div>{renderComments}</div>;
}
