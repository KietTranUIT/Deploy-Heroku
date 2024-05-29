import React from "react";
import "./card.css";
import { Parallax } from 'react-parallax';
import { useMediaQuery } from "react-responsive";
function Card() {
  const view1 = useMediaQuery({ query: "(max-width: 564px)" });
  const view2 = useMediaQuery({ query: "(max-width: 420px)" });
}

export default Card;
