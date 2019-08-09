import * as React from "react";
import { useSpring, animated, SpringValue } from "react-spring";
import { usePrevious } from "./use-previous";
import { useGestureResponder } from "react-gesture-responder";
import { Pane } from "./Pane";
import useScrollLock from "use-scroll-lock";

export interface CubeProps {
  hasNext?: (i: number) => boolean;
  renderItem: (
    i: number,
    active: boolean,
    rotate: SpringValue<number>
  ) => React.ReactNode;
  width?: number;
  height?: number;
}

/**
 * React-Cube
 *
 * A 3d rotated cube which supports gestures
 * and an infinite number of views (i.e., it supports
 * windowing). It's inspired by the instagram story
 * inteface.
 */

export function Cube({
  hasNext = () => true,
  renderItem,
  width = 200,
  height = 600
}: CubeProps) {
  const [props, set] = useSpring(() => ({ rotateY: 0 }));
  const [index, setIndex] = React.useState(0);
  const prevIndex = usePrevious(index);
  const [indexesToRender, setIndexesToRender] = React.useState([0, 1, 2, -1]);
  const currentActivePane = index % 4;
  const [animating, setAnimating] = React.useState(false);

  // lock body scrolling when gesturing or animating
  useScrollLock(animating);

  /**
   * Animate our cube into position when our active
   * index changes
   */

  function onRest() {
    setAnimating(false);
  }

  React.useEffect(() => {
    setAnimating(true);
    set({ rotateY: index * 90 * -1, immediate: false, onRest });
  }, [onRest, index, set]);

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
        set({ rotateY: index * 90 * -1, onRest: () => {}, immediate: false });
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
      if (!animating) {
        setAnimating(true);
      }

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
        immediate: true,
        onRest: () => {}
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
        perspective: "900px"
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
        {/* The initial left  pane */}
        <Pane
          tabIndex={-1}
          width={width}
          height={height}
          rotate={-90}
          active={currentActivePane === 3}
        >
          {renderItem(
            indexesToRender[3],
            currentActivePane === 3 && !animating,
            props.rotateY
          )}
        </Pane>

        {/* The initial front  pane */}
        <Pane
          tabIndex={-1}
          width={width}
          height={height}
          rotate={0}
          active={currentActivePane === 0}
        >
          {renderItem(
            indexesToRender[0],
            currentActivePane === 0 && !animating,
            props.rotateY
          )}
        </Pane>

        {/* The initial right pane */}
        <Pane
          tabIndex={-1}
          width={width}
          height={height}
          rotate={90}
          active={currentActivePane === 1}
        >
          {renderItem(
            indexesToRender[1],
            currentActivePane === 1 && !animating,
            props.rotateY
          )}
        </Pane>

        {/* The initial back pane */}
        <Pane
          tabIndex={-1}
          width={width}
          height={height}
          rotate={-180}
          active={currentActivePane === 2}
        >
          {renderItem(
            indexesToRender[2],
            currentActivePane === 2 && !animating,
            props.rotateY
          )}
        </Pane>
      </animated.div>
    </div>
  );
}
