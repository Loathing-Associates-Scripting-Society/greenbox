import { useEffect, useRef, useState } from "react";

import Spinner from "./Spinner";

function floodErase(data: Uint8ClampedArray, width: number) {
  const visited = new Set();

  function eraser(i: number) {
    // Don't revist or go out of bounds
    if (i < 0 || i >= data.length || visited.has(i)) return;
    visited.add(i);

    // If not white, stop here
    if (data[i] + data[i + 1] + data[i + 2] < 765) {
      return;
    }

    // Set this pixel to transparent
    data[i + 3] = 0;

    // And visit neighbours
    eraser(i - width * 4); // Visit top
    eraser(i + 4); // Visit right
    eraser(i + width * 4); // Visit bottom
    eraser(i - 4); // Visit left
  }

  // Start an erase process from each corner
  eraser(0);
  eraser(width * 4 - 8);
  eraser(data.length - width * 4);
  eraser(data.length - 8);
}

type Props = {
  src: string;
  sourceWidth?: number;
  sourceHeight?: number;
  title?: string;
};

export default function AlphaImage({
  src,
  title,
  sourceWidth = 30,
  sourceHeight = sourceWidth,
}: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;

    const image = new Image();
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, sourceWidth, sourceHeight);
      floodErase(imageData.data, sourceWidth);
      ctx.putImageData(imageData, 0, 0);
      setLoading(false);
    };
    image.crossOrigin = "anonymous";
    image.src = `https://s3.amazonaws.com/images.kingdomofloathing.com/${src}`;
  }, [canvas.current, src]);

  return (
    <>
      {loading && <Spinner />}
      <canvas
        title={title}
        style={{ display: loading ? "none" : "block" }}
        ref={canvas}
        width={sourceWidth}
        height={sourceHeight}
      />
    </>
  );
}