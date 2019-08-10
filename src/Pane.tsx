import * as React from "react";

export interface PaneProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  active: boolean;
  width: number;
  rotate: number;
  height: number;
}

export function Pane({
  children,
  active,
  width,
  rotate,
  height,
  style,
  ...other
}: PaneProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (active && ref.current) {
      ref.current!.focus();
    }
  }, [active]);

  return (
    <div
      className="Cube__Pane"
      aria-hidden={!active}
      tabIndex={active ? 0 : -1}
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        backfaceVisibility: "visible",
        outline: "none",
        padding: "3px",
        position: "absolute",
        width: width + "px",
        height: height + "px",
        transform: `rotateY(${rotate}deg) translateZ(${width / 2}px)`,
        ...style
      }}
      {...other}
    >
      {children}
    </div>
  );
}
