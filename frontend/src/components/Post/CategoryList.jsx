import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
export default function CategoryList(props) {
  const history = useHistory();
  let renderCategories = [];
  if (props.categories) {
    renderCategories = props.categories.map((value, index) => {
      return (
        <Button
          key={index}
          onClick={() => {
            console.log(value);
            history.push("/category/" + value.categoryID + "/" + value.name);
          }}
        >
          {value.name}
        </Button>
      );
    });
  }
  return (
    <ButtonGroup
      variant="text"
      color="primary"
      aria-label="text primary button group"
    >
      {renderCategories}
    </ButtonGroup>
  );
}
