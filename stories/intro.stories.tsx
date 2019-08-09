import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Cube } from "../src/Cube";

storiesOf("Hello", module).add("Example", () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "2rem"
      }}
    >
      <Cube
        width={300}
        hasNext={i => i < 9}
        renderItem={(i, active) => {
          return (
            <div>
              {items[i]}
              {active ? "active" : ""}
            </div>
          );
        }}
      />
    </div>
  );
});
