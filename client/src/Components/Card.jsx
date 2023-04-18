import React, { useState } from "react";
import { ThreeCircles } from "react-loader-spinner";

function Card({ details, handleDrag, handleDrop, cardNumber, openModal }) {
  const [isLoading, setIsLoading] = useState(false);
  const handleCardClick = () => {
    openModal(details);
  };
  const handleLoad = () => {
    setIsLoading(false);
  };
  return (
    <div
      className="card "
      draggable={true}
      id={cardNumber}
      onDragOver={(ev) => ev.preventDefault()}
      onDragStart={handleDrag}
      onDrop={handleDrop}
      onClick={handleCardClick}
    >
      {isLoading && (
        <ThreeCircles
          height="100"
          width="100"
          color="black"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="three-circles-rotating"
          outerCircleColor=""
          innerCircleColor=""
          middleCircleColor=""
        />
      )}
      <img
        onLoad={handleLoad}
        src={details.url}
        alt={details.title}
        height={50}
        width={50}
        className="card-img-top"
        style={{ display: isLoading ? "none" : "block" }}
      />
      <p className="">{details.title}</p>
    </div>
  );
}

export default Card;
