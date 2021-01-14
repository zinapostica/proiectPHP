import React, { useState, useEffect } from "react";
import Question from "./Question";
import axios from "axios";
import { List, ListItem } from "@material-ui/core";
export default function QuestionList(props) {
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    setQuestions(props.questions);
  }, [props.questions]);

  const deleteQuestion = async (question) => {
    const response = await axios.delete("/api/deleteQuestion", {
      data: { questionID: question.id },
    });
    console.log(response.data);
    if (response.data.status == "success") {
      const index = questions.indexOf(question);
      console.log(index);
      if (index > -1) {
        setQuestions(questions.splice(index, 1));
      }
    }
  };
  console.log(props.questions);
  let renderQuestions;
  if (questions.length) {
    renderQuestions = questions.map((val, index) => {
      return (
        <ListItem key={index}>
          <Question
            
            question={val}
            deleteQuestion={deleteQuestion}
          />
        </ListItem>
      );
    });
  } else {
    renderQuestions = "No questions to display";
  }
  return <List>{renderQuestions}</List>;
}
