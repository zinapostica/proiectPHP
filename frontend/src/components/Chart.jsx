import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";

export default function Chart(props) {
  const [state, setState] = useState({
    dataBar: {
      labels: [],
      datasets: [
        {
          label: "count",
          data: [],
          borderWidth: 2,
        },
      ],
    },
  });
  useEffect(() => {
    setState({
      dataBar: {
        labels: props.labels,
        datasets: [
          {
            label: "count",
            data: props.data,
            borderWidth: 2,
          },
        ],
      },
    });
    console.log("miau");
  }, [props.data, props.labels]);

  return (
    <MDBContainer>
      <h3 style={{ color: "#3f50b5" }}>{props.title}</h3>
      <Bar data={state.dataBar} />
    </MDBContainer>
  );
}
