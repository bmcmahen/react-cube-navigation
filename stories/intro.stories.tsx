import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Cube } from "../src/Cube";
import "./stories.css";

const images = [
  "https://images.unsplash.com/photo-1565371557106-c2abcc6fb36a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
  "https://images.unsplash.com/photo-1565361849078-294849288ced?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
  "https://images.unsplash.com/photo-1565279799937-b397e6483124?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=619&q=80",
  "https://images.unsplash.com/photo-1565264216052-3c9012481a1f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
  "https://images.unsplash.com/photo-1565274952013-13cecde5c8b1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
  "https://images.unsplash.com/photo-1565287753977-e94d0227c640?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=633&q=80",
  "https://images.unsplash.com/photo-1565340076861-7a6667b36072?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1565259901762-b8d797c6f887?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
];

storiesOf("Hello", module).add("Example", () => {
  return <Example />;
});

function Example() {
  const w = window.innerWidth - 25;
  const h = window.innerHeight - 25;
  const [index, setIndex] = React.useState(3);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        position: "relative"
      }}
    >
      <button
        onClick={() => setIndex(index - 1)}
        style={{
          display: index > 0 ? "block" : "none",
          position: "absolute",
          left: 0
        }}
      >
        back
      </button>
      <Cube
        onChange={i => setIndex(i)}
        index={index}
        width={w > 375 ? 375 : w}
        height={h > 600 ? 600 : h}
        lockScrolling
        hasNext={i => i < images.length - 1}
        renderItem={(i, active) => {
          if (!images[i]) {
            return null;
          }

          return (
            <div
              style={{
                backgroundImage: `url(${images[i]})`,
                backgroundSize: "cover",
                flex: 1,

                borderRadius: "1rem"
              }}
            />
          );
        }}
      />
      <button
        onClick={() => setIndex(index + 1)}
        style={{
          display: index !== images.length - 1 ? "block" : "none",
          position: "absolute",
          right: 0
        }}
      >
        forward
      </button>
    </div>
  );
}

function VideoPane({ active, video }: { active: boolean; video: string }) {
  const ref = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (active && ref.current) {
      ref.current!.play();
    }

    return () => {
      ref.current!.pause();
    };
  }, [active]);

  return (
    <div
      style={{
        overflow: "hidden",
        borderRadius: "1rem",
        display: "flex",
        flex: 1
      }}
    >
      <video
        playsInline
        style={{
          objectFit: "cover",
          flex: 1
        }}
        ref={ref}
        src={video}
      />
    </div>
  );
}
