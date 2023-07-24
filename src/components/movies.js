import React, { useState, useEffect } from "react";
import axios from "axios";
import "./movies.css";
import ConfirmationModal from "./ConfirmationModall";
import { useNavigate } from "react-router-dom";

function Movies() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [selectedProjection, setSelectedProjection] = useState(null);
  const [date, setDate] = useState(null);
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState([]);
  const [singleMovie, setSingleMovie] = useState(null);
  const [userData, setUserData] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [email, setEmail] = useState("");
  const [movieData, setMovieData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/movies").then((response) => {
      console.log(response);
      setMovies(response.data);
    });
  }, []);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./login";
  };

  const handleImageClick = async (id) => {
    setSelectedProjection(id);
    setShowConfirmation(true);
    getMovieById(id);
    getUserById(id);
  };

  const getMovieById = (id) => {
    axios
      .get(`http://localhost:5000/movies/${id}`)
      .then((response) => {
        const movie = response.data;
        console.log(movie);
        if (movie) {
          setSingleMovie(movie);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUserById = (id) => {
    axios
      .get(`http://localhost:5000/register/${id}`)
      .then((response) => {
        const user = response.data;
        console.log(user);
        if (user) {
          setUserData(user);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDateSelect = (dateValue) => {
    setDate(dateValue);
  };

  const handleConfirm = () => {
    setShowEmailInput(true);
  };

  const handleCancel = () => {
    setSelectedProjection(null);
    setDate(null);
    setShowConfirmation(false);
    setShowEmailInput(false);
  };

  const incrementTicket = () => {
    setTicketQuantity(ticketQuantity + 1);
  };

  const decrementTicket = () => {
    if (ticketQuantity > 1) {
      setTicketQuantity(ticketQuantity - 1);
    }
  };

  return (
    <div>
      <ul className='navbar'>
        <div>
          <li className='current'>
            <a href='#' data-hover='TOP FILMOVI'>
              TOP FILMOVI
            </a>
          </li>
          <li>
            <a href='/soonmovies' data-hover='USKORO U KINU'>
              USKORO U KINU
            </a>
          </li>
        </div>
        <li>
          <button onClick={logOut} className='btn btn-primary logoutbtn'>
            Log Out
          </button>
        </li>
      </ul>
      <div>
        <h4 style={{ color: "white", fontWeight: "700" }} className='text-center my-4 leading-6'>
          TOP FILMOVI
        </h4>
      </div>

      <div className='films-container'>
        <div className='film'>
          {movies.map((movie) => {
            return (
              <div className='filmovi' key={movie._id}>
                <img
                  src={movie.image}
                  alt='movie'
                  className='img-card col-lg-4 col-md-6 col-sm-12 col-12'
                  style={{ maxWidth: 250, width: "90%" }}
                  onClick={() => handleImageClick(movie._id)}
                />
                <p className='movie-title'>{movie.title}</p>
              </div>
            );
          })}
        </div>
      </div>

      {showConfirmation && (
        <div
          className='modal'
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 9999,
          }}
        >
          <ConfirmationModal
            singleMovie={singleMovie}
            userData={userData}
            handleCancel={handleCancel}
            handleConfirm={handleConfirm}
            ticketQuantity={ticketQuantity}
            incrementTicket={incrementTicket}
            decrementTicket={decrementTicket}
            movieData={movieData}
            handleDateSelect={handleDateSelect}
          />
        </div>
      )}
    </div>
  );
}

export default Movies;
