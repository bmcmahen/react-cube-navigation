import * as React from "react";
import { useSpring, animated } from "react-spring";
import { usePrevious } from "./use-previous";

export function Cube() {
  const cubeFaceStyle = {
    position: "absolute",
    width: "200px",
    height: "500px",
    background: "#ddd",
    border: "1px solid black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  } as any;

  const [props, set] = useSpring(() => ({ rotateY: 0 }));
  const [index, setIndex] = React.useState(0);
  const prevIndex = usePrevious(index);

  React.useEffect(() => {
    set({ rotateY: index * 90 * -1 });
  }, [index, set]);

  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [indexesToRender, setIndexesToRender] = React.useState([-1, 0, 1, 2]);

  /**
   * Handle rendering of individual panes.
   */

  React.useEffect(() => {
    if (prevIndex && prevIndex !== index) {
      let movingForward = index > prevIndex;
      let indexes = [...indexesToRender];
      if (movingForward) {
        const minIndex = indexes.indexOf(Math.min(...indexes));
        indexes[minIndex] = Math.max(...indexes) + 1;
      } else {
        const maxIndex = indexes.indexOf(Math.max(...indexes));
        indexes[maxIndex] = Math.min(...indexes) - 1;
      }
      setIndexesToRender(indexes);
    }
  }, [prevIndex, index]);

  return (
    <div
      style={{
        width: "200px",
        height: "500px",
        perspective: "600px"
      }}
      onClick={e => {
        if (!e.metaKey) {
          setIndex(index + 1);
        } else {
          setIndex(index - 1);
        }
      }}
    >
      <animated.div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transform: props.rotateY.to(
            x => `translateZ(-100px) rotateY(${x}deg)`
          )
        }}
      >
        <div
          style={{
            ...cubeFaceStyle,
            transform: `rotateY(-90deg) translateZ(100px)`
          }}
        >
          {items[indexesToRender[0]]}
        </div>

        <div
          style={{
            ...cubeFaceStyle,
            transform: `rotateY(0deg) translateZ(100px)`
          }}
        >
          {items[indexesToRender[1]]}
        </div>
        <div
          style={{
            ...cubeFaceStyle,
            transform: `rotateY(90deg) translateZ(100px)`
          }}
        >
          {items[indexesToRender[2]]}
        </div>

        <div
          style={{
            ...cubeFaceStyle,
            transform: `rotateY(-180deg) translateZ(100px)`
          }}
        >
          {items[indexesToRender[3]]}
        </div>
      </animated.div>
    </div>
  );
}
