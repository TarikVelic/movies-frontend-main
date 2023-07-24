import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ConfirmationModal({
  singleMovie,
  userData,
  handleCancel,
  handleConfirm,
  ticketQuantity,
  incrementTicket,
  decrementTicket,
}) {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedProjection, setSelectedProjection] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [randomString, setRandomString] = useState("");

  const generateRandomString = (length) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }
    return result;
  };

  const handleEmailConfirm = () => {
    const price = parseFloat(singleMovie.price[selectedProjection]).toFixed(2);

    const generatedString = generateRandomString(8);
    setRandomString(generatedString);

    const movieData = {
      title: singleMovie.title,
      projection: singleMovie.showtimes[selectedProjection],
      hall: singleMovie.hall[selectedProjection],
      type: singleMovie.type[selectedProjection],
      price: price,
      ticketQuantity: parseFloat(ticketQuantity).toFixed(0),
      selectedDate: selectedDate,
      saldo: parseFloat(ticketQuantity * price).toFixed(2),
      image: singleMovie.image,
      randomString: generatedString,
    };

    const data = {
      email: email,
      templateName: "ticketPurchase",
      movieData: movieData,
    };

    axios
      .post("http://localhost:5000/sendemail", data)
      .then((response) => {
        toast.success("E-pošta je uspješno poslana!");
      })
      .catch((error) => {
        toast.error("Došlo je do greške prilikom slanja e-pošte: " + error.message);
      });

    handleConfirm(email);
    setShowEmailModal(false);
  };

  const handleEmailCancel = () => {
    setEmail("");
    setShowEmailModal(false);
  };

  const handleProjectionSelect = (index) => {
    setSelectedProjection(index);
  };

  const handleNastavi = () => {
    const isValid = selectedProjection !== null && ticketQuantity > 0;
    setShowEmailModal(isValid);
  };

  return (
    <div className='modal-dialog' style={{ margin: "10% auto", maxWidth: 600 }}>
      <div className='modal-content'>
        <div className='modal-header'>
          <h5 className='modal-title'>Potvrda kupovine karata</h5>
          <button type='button' className='close' onClick={handleCancel}>
            <span aria-hidden='true'>×</span>
          </button>
        </div>
        <div className='modal-body'>
          <h6>Odaberite projekciju i datum:</h6>
          <div className='form-group'>
            <label htmlFor='projectionSelect'>Projekcija:</label>
            <h3 className='mb-4 mt-4'>Odabrali ste film: {singleMovie?.title}</h3>
          </div>
          <div className='form-group'>
            {" "}
            {/* Dodano */}
            <label htmlFor='dateSelect'>Datum:</label>
            <select
              id='dateSelect'
              className='form-control'
              onChange={(e) => setSelectedDate(e.target.value)}
              value={selectedDate}
            >
              {getFutureDates(7).map((date, index) => (
                <option id='DaySelect' key={index} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <div id='projectionTimeSelect' className='btn-group' role='group'>
              {singleMovie?.showtimes &&
                singleMovie.showtimes.map((time, index) => (
                  <button
                    type='button'
                    className={`btn btn-secondary ${selectedProjection === index ? "active" : ""}`}
                    onClick={() => handleProjectionSelect(index)}
                  >
                    <div className='projection-info'>
                      <div className='projection-info-time'>{time}</div>
                      <div className='projection-info-hall'>{singleMovie?.hall && singleMovie.hall[index]}</div>
                      <div className='projection-info-type'>{singleMovie?.type && singleMovie.type[index]}</div>
                      <div className='projection-info-price'>{singleMovie?.price && singleMovie.price[index]} KM</div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='ticketQuantity'>Odrasla osoba:</label>
            <div className='ticket-quantity'>
              <button type='button' className='decrement-button' onClick={decrementTicket}>
                -
              </button>
              <span className='quantity'>{ticketQuantity}</span>
              <button type='button' className='increment-button' onClick={incrementTicket}>
                +
              </button>
            </div>
            <label htmlFor='ticketQuantity'>Ukupno karata:</label>
            <span className='ticketQuantity'>{ticketQuantity}</span>
          </div>
        </div>
        <div className='modal-footer'>
          <button type='button' className='odustani' onClick={handleCancel}>
            Odustani
          </button>
          <button type='button' className='potvrdi' onClick={handleNastavi}>
            Nastavi
          </button>
        </div>
      </div>

      <Modal
        isOpen={showEmailModal}
        onRequestClose={handleEmailCancel}
        className='email-modal-overlay'
        overlayClassName='email-modal-overlay'
        ariaHideApp={false}
      >
        <div className='email-modal-content'>
          <h5 className='modal-title'>Unesite e-mail</h5>
          <input
            type='email'
            id='email'
            name='email'
            placeholder='Unesite vaš e-mail'
            className='email-input'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className='modal-footer'>
            <button type='button' className='odustani' onClick={handleEmailCancel}>
              Odustani
            </button>
            <button type='button' className='potvrdi nastavihover' onClick={handleEmailConfirm} disabled={!email}>
              Potvrdi
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function getFutureDates(days) {
  var futureDates = [];
  var today = new Date();
  var options = { weekday: "long", year: "numeric", month: "long", day: "numeric", locale: "sr-ME" };

  for (var i = 0; i < days; i++) {
    var date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    futureDates.push(date.toLocaleDateString("sr-ME", options));
  }

  return futureDates;
}

export default ConfirmationModal;
