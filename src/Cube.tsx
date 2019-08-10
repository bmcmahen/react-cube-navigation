import * as React from "react";
import { useSpring, animated, SpringValue } from "react-spring";
import { usePrevious } from "./use-previous";
import { useGestureResponder } from "react-gesture-responder";
import { Pane } from "./Pane";
import useScrollLock from "use-scroll-lock";

export interface CubeProps {
  hasNext?: (i: number) => boolean;
  index: number;
  onChange: (i: number) => void;
  renderItem: (
    i: number,
    active: boolean,
    rotate: SpringValue<number>
  ) => React.ReactNode;
  width?: number;
  height?: number;
  perspective?: number;
  paneStyle?: React.CSSProperties;
  scaleRange?: [number, number];
  lockScrolling?: boolean;
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
  onChange,
  index,
  renderItem,
  width = 200,
  height = 600,
  perspective = 1200,
  paneStyle,
  scaleRange = [1, 0.95],
  lockScrolling = false
}: CubeProps) {
  const [props, set] = useSpring(() => ({
    rotateY: index * -90,
    immediate: true
  }));
  const prevIndex = usePrevious(index);
  const [indexesToRender, setIndexesToRender] = React.useState([
    index,
    index + 1,
    index + 2,
    index - 1
  ]);
  const currentActivePane = index % 4;
  const [animating, setAnimating] = React.useState(false);

  // lock body scrolling when gesturing or animating
  useScrollLock(animating || lockScrolling);

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
        onChange(delta[0] < 0 ? index + 1 : index - 1);
        return;
      }

      // next
      if (delta[0] < -(width / 2)) {
        onChange(index + 1);

        // prev
      } else if (delta[0] > width / 2) {
        onChange(index - 1);

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
    // todo: usecallback style updates
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

      console.log(indexesToRender, indexes);
      setIndexesToRender(indexes);
    }
  }, [prevIndex, indexesToRender, index]);

  // todo: also alter scale slightly on rotate

  return (
    <div
      className="Cube"
      style={{
        width: width + "px",
        height: height + "px",
        perspective: perspective + "px"
      }}
      {...bind}
    >
      <animated.div
        className="Cube__animated-container"
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          backfaceVisibility: "visible",
          transformStyle: "preserve-3d",
          transform: props.rotateY.to(
            x =>
              `translateZ(-${width / 2}px) rotateY(${x}deg) scale(${getScale(
                x,
                scaleRange
              )})`
          )
        }}
      >
        {/* The initial left  pane */}
        <Pane
          width={width}
          height={height}
          rotate={-90}
          active={currentActivePane === 3}
          style={paneStyle}
        >
          {renderItem(
            indexesToRender[3],
            currentActivePane === 3 && !animating,
            props.rotateY
          )}
        </Pane>

        {/* The initial front  pane */}
        <Pane
          width={width}
          height={height}
          rotate={0}
          active={currentActivePane === 0}
          style={paneStyle}
        >
          {renderItem(
            indexesToRender[0],
            currentActivePane === 0 && !animating,
            props.rotateY
          )}
        </Pane>

        {/* The initial right pane */}
        <Pane
          width={width}
          height={height}
          rotate={90}
          active={currentActivePane === 1}
          style={paneStyle}
        >
          {renderItem(
            indexesToRender[1],
            currentActivePane === 1 && !animating,
            props.rotateY
          )}
        </Pane>

        {/* The initial back pane */}
        <Pane
          width={width}
          height={height}
          rotate={-180}
          active={currentActivePane === 2}
          style={paneStyle}
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

function getScale(x: number, scaleRange: [number, number]) {
  const diff = Math.abs(x) % 90;

  if (!diff) {
    return 1;
  }

  const a = diff > 45 ? [90, 45] : [45, 0];
  const b = diff > 45 ? scaleRange : [scaleRange[1], scaleRange[0]];
  const o = a[1] - a[0];
  const n = b[1] - b[0];
  let v = ((diff - a[0]) * n) / o + b[0];

  return v;
}
