# react-cube-navigation

React Cube Navigation provides an animated cube style navigation pattern like that found in Instagram stories.

[Demo on CodeSandbox](https://codesandbox.io/embed/react-cube-navigation-example-gngpz)

## Features

- Render an infinite number of panes
- Gesture based controls
- Spring based animations

## Install

Install `react-cube-navigation` and its peer dependency `react-gesture-responder` using yarn or npm.

```
yarn add react-cube-navigation react-gesture-responder
```

## Basic usage

```jsx
import Cube from "react-cube-navigation";

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

function Example() {
  return (
    <Cube
      width={300}
      height={600}
      hasNext={i => i < images.length - 1}
      renderItem={(i, active) => {
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
  );
}
```

## API

### Cube

| Name          | Type                                             | Default Value | Description                                          |
| ------------- | ------------------------------------------------ | ------------- | ---------------------------------------------------- |
| renderItem \* | (i: number, active: boolean) => React.ReactNode; |               | A callback to render cube panes                      |
| hasNext       | (i: number) => boolean                           | true          | Whether another pane exists after the provided index |
| width         | number                                           | 200           | The width of the cube in pixels                      |
| height        | number                                           | 600           | The height of the cube in pixels                     |
| perspective   | number                                           | 1200          | The perspective of the cube in pixels                |
| paneStyle     | React.CSSProperties                              |               | Pane container styles                                |
| scaleRange    | [number, number]                                 | [1, 0.95]     | The scale range to shrink the cube when swiping      |
| lockScrolling | boolean                                          | false         | Lock all page scrolling                              |
