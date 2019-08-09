import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Cube } from "../src/Cube";

storiesOf("Hello", module).add("Example", () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "2rem"
    }}
  >
    <Cube />
  </div>
));
