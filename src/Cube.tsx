import * as React from "react";
import { useSpring, animated, SpringValue } from "react-spring";
import { useGestureResponder } from "react-gesture-responder";
import useScrollLock from "use-scroll-lock";
import { usePrevious } from "./use-previous";
import { Pane } from "./Pane";

export interface CubeIndexObject {
  index: number;
  immediate: boolean;
}

export type CubeIndex = number | CubeIndexObject;

export interface CubeProps {
  hasNext?: (i: number) => boolean;
  index: CubeIndex;
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
  enableGestures?: boolean;
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
  index: providedIndex,
  renderItem,
  width = 200,
  height = 600,
  perspective = 800,
  paneStyle,
  scaleRange = [1, 0.95],
  lockScrolling = false,
  enableGestures = true
}: CubeProps) {
  // optionally allow the user to pass in an object
  // with an index and animated property. This allows
  // the user to skip to an index without animating.
  let { immediate, index } =
    typeof providedIndex === "number"
      ? { immediate: false, index: providedIndex }
      : providedIndex;

  const [props, set] = useSpring(() => ({
    rotateY: index * -90,
    immediate: true
  }));

  const prevIndex = usePrevious(index);
  const currentActivePane = index % 4;

  // this is a mess... gotta refactor. basically it determines
  // what the initial render indexes should be given the
  // initial index to show
  const [indexesToRender, setIndexesToRender] = React.useState(() =>
    resetIndexes(index, true)
  );

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
    set({ rotateY: index * 90 * -1, immediate, onRest });
  }, [onRest, index, set, immediate]);

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
      if (!enableGestures) {
        return false;
      }

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
      const convert = linearConversion(
        [0, width],
        [currentRotate, currentRotate + 90]
      );
      let v = convert(delta[0]);

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
    if (typeof prevIndex === "number" && prevIndex !== index) {
      setIndexesToRender(indexesToRender =>
        resetIndexes(index, index > prevIndex, [...indexesToRender])
      );
    }
  }, [prevIndex, indexesToRender, index, immediate]);

  return (
    <animated.div
      className="Cube"
      style={{
        width: width + "px",
        height: height + "px",
        transform: props.rotateY.to(x => `scale(${getScale(x, scaleRange)}`),
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
            x => `translateZ(-${width / 2}px) rotateY(${x}deg)`
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
    </animated.div>
  );
}

function getScale(x: number, scaleRange: [number, number]) {
  const diff = Math.abs(x) % 90;

  if (!diff) {
    return 1;
  }

  const convert =
    diff > 45
      ? linearConversion([90, 45], [1, 0.5])
      : linearConversion([45, 0], [0.5, 1]);

  const eased = circ(convert(diff));
  const scale = linearConversion([1, 0.5], scaleRange);
  return scale(eased);
}

function linearConversion(a: [number, number], b: [number, number]) {
  var o = a[1] - a[0],
    n = b[1] - b[0];

  return function(x: number) {
    return ((x - a[0]) * n) / o + b[0];
  };
}

function circ(timeFraction: number) {
  return 1 - Math.sin(Math.acos(timeFraction));
}

function resetIndexes(
  index: number,
  forward: boolean,
  indexes = [-1, -1, -1, -1]
) {
  const currentActivePane = index % 4;
  indexes[currentActivePane] = index;

  const prevIndex = getPreviousIndex(currentActivePane - 1);
  indexes[prevIndex] = index - 1;

  const nextIndex = getNextIndex(currentActivePane + 1);
  indexes[nextIndex] = index + 1;

  if (forward) {
    indexes[getNextIndex(nextIndex + 1)] = index + 2;
  } else {
    indexes[getPreviousIndex(prevIndex - 1)] = index - 2 < -1 ? -1 : index - 2;
  }

  return indexes;
}

function getPreviousIndex(i: number) {
  if (i > -1) return i;
  return 3;
}

function getNextIndex(i: number) {
  if (i < 4) return i;
  return 0;
}
