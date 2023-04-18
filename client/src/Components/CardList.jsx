import React, { useState, useEffect } from "react";
import Card from "./Card";
import ImageViewer from "./ImageViewer";
import { ThreeCircles } from "react-loader-spinner";

function CardList() {
  const [dragId, setDragId] = useState();
  const [cards, setCards] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  useEffect(() => {
    setIsSaving(true);
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/getImages");
        const { images } = await response.json();
        console.log(images);
        setCards(images);
        setIsSaving(false);
      } catch (error) {
        console.error(error);
      }
    };
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);
  const openModal = (details) => {
    console.log("Clicked", details);
    setModalShow(true);
    setModalImage(details.url);
  };
  useEffect(() => {
    const interval = setInterval(async () => {
      if (hasChanged) {
        setIsSaving(true);
        console.log("The data was changed and need to be saved");
        const updateData = async () => {
          try {
            const response = await fetch(
              "http://localhost:8000/api/updatePosition",
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(cards),
              }
            );
            let res = await response.json();
            console.log(res);
            setCards(cards);
            setLastSaveTime(Date.now());
            setHasChanged(false);
            setIsSaving(false);
          } catch (error) {
            console.error(error);
          }
        };
        updateData();
      } else {
        console.log("NO the data wasn't changed even after 5 seconds");
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [hasChanged]);

  const closeModal = () => {
    setModalShow(false);
  };
  const handleDrag = (ev) => {
    setDragId(ev.currentTarget.id);
  };
  const handleDrop = (ev) => {
    const dragBox = cards.find((cat) => cat.id == dragId);
    const dropBox = cards.find((cat) => cat.id == ev.currentTarget.id);
    const dragBoxOrder = dragBox.position;
    const dropBoxOrder = dropBox.position;
    const newBoxState = cards.map((card) => {
      if (card.id == dragId) {
        return { ...card, position: dropBoxOrder };
      }
      if (card.id == ev.currentTarget.id) {
        return { ...card, position: dragBoxOrder };
      }
      return card;
    });
    setCards((prevState) => {
      // Sort newBoxState by position before updating state
      newBoxState.sort((a, b) => a.position - b.position);
      return newBoxState;
    });
    setHasChanged(true);
    setIsSaving(true);
  };
  return (
    <div className="card-list">
      {isSaving ? (
        <div>
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
          {lastSaveTime ? `${(Date.now() - lastSaveTime) / 1000}s ago` : ""}
        </div>
      ) : (
        cards
          .sort((a, b) => a.position - b.position)
          .map((item) => {
            return (
              <Card
                openModal={openModal}
                details={item}
                key={item.position}
                cardNumber={item.id}
                handleDrag={handleDrag}
                handleDrop={handleDrop}
              />
            );
          })
      )}
      <ImageViewer
        image={modalImage}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
}

export default CardList;
