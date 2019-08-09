import * as React from "react";
import { useSpring, animated } from "react-spring";
import { usePrevious } from "./use-previous";
import { useGestureResponder } from "react-gesture-responder";

export interface CubeProps {
  hasNext?: (i: number) => boolean;
  renderItem: (i: number) => React.ReactNode;
  width?: number;
  height?: number;
}

export function Cube({
  hasNext = () => true,
  renderItem,
  width = 200,
  height = 600
}: CubeProps) {
  const cubeFaceStyle = {
    position: "absolute",
    width: width + "px",
    height: height + "px",
    background: "#ddd",
    border: "1px solid black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  } as any;

  // replace with props
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [props, set] = useSpring(() => ({ rotateY: 0 }));
  const [index, setIndex] = React.useState(0);
  const prevIndex = usePrevious(index);
  const [indexesToRender, setIndexesToRender] = React.useState([0, 1, 2, -1]);

  /**
   * Animate our cube into position when our active
   * index changes
   */

  React.useEffect(() => {
    set({ rotateY: index * 90 * -1 });
  }, [index, set]);

  /**
   * On drag end, determine the index to show
   */

  const onEnd = React.useCallback(
    ({ delta, velocity }) => {
      if (velocity > 0.12) {
        setIndex(delta[0] < 0 ? index + 1 : index - 1);
        return;
      }

      // next
      if (delta[0] < -(width / 2)) {
        setIndex(index + 1);

        // prev
      } else if (delta[0] > width / 2) {
        setIndex(index - 1);

        // current
      } else {
        set({ rotateY: index * 90 * -1 });
      }
    },
    [index, width]
  );

  /**
   * Support basic drag gestures
   */

  const { bind } = useGestureResponder({
    onStartShouldSet: () => false,
    onMoveShouldSet: ({ direction }) => {
      // beginning of stack and swiping left
      if (index === 0 && direction[0] > 0) {
        return false;
      }

      // end of stack and swiping right
      if (direction[0] < 0 && !hasNext(index)) {
        return false;
      }

      // swiping horizontally
      return Math.abs(direction[0]) > Math.abs(direction[1]);
    },
    onRelease: onEnd,
    onTerminate: onEnd,
    onMove: ({ delta }) => {
      const currentRotate = index * 90 * -1;
      const a = [0, width];
      const b = [currentRotate, currentRotate + 90];
      const x = delta[0];
      const o = a[1] - a[0];
      const n = b[1] - b[0];
      let v = ((x - a[0]) * n) / o + b[0];

      if (v > currentRotate + 90) {
        v = currentRotate + 90;
      } else if (v < currentRotate - 90) {
        v = currentRotate - 90;
      }

      set({
        rotateY: v,
        immediate: true
      });
    }
  });

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
        const next = Math.min(...indexes) - 1;
        if (next > -1) {
          indexes[maxIndex] = Math.min(...indexes) - 1;
        }
      }
      setIndexesToRender(indexes);
    }
  }, [prevIndex, indexesToRender, index]);

  return (
    <div
      style={{
        width: width + "px",
        height: height + "px",
        perspective: "600px"
      }}
      {...bind}
    >
      <animated.div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transform: props.rotateY.to(
            x => `translateZ(-${width / 2}px) rotateY(${x}deg)`
          )
        }}
      >
        <div
          style={{
            ...cubeFaceStyle,
            transform: `rotateY(-90deg) translateZ(${width / 2}px)`
          }}
        >
          {renderItem(indexesToRender[3])}
        </div>

        <div
          style={{
            ...cubeFaceStyle,
            transform: `rotateY(0deg) translateZ(${width / 2}px)`
          }}
        >
          {renderItem(indexesToRender[0])}
        </div>
        <div
          style={{
            ...cubeFaceStyle,
            transform: `rotateY(90deg) translateZ(${width / 2}px)`
          }}
        >
          {renderItem(indexesToRender[1])}
        </div>

        <div
          style={{
            ...cubeFaceStyle,
            transform: `rotateY(-180deg) translateZ(${width / 2}px)`
          }}
        >
          {renderItem(indexesToRender[2])}
        </div>
      </animated.div>
    </div>
  );
}
