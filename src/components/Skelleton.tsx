import { CSSProperties } from "react";

export default function Skelleton({ width, height }: Pick<CSSProperties, "width" | "height">) {
  return (
    <span style={{ width, height }} className="shadow rounded-lg p-4 animate-pulse bg-black" />
  );
}
