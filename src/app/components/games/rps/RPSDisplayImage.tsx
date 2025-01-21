import React from "react";
import { MovesEnum } from "./RPSConfig";

const RPSDisplayImage = ({
  move,
  size,
  className,
}: {
  move: MovesEnum;
  size?: string | number;
  className?: string;
}) => {
  return (
    <img
      className={className ?? ""}
      src={`./rps/${move}.png`}
      alt={`${move} img`}
      width={size ?? 100}
      height={size ?? 100}
    />
  );
};

export default RPSDisplayImage;
