import React, { useState, useEffect } from "react";
import axios from "axios";
import "./movies.css";
import { useNavigate } from "react-router-dom";

function Movies() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedProjection, setSelectedProjection] = useState(null);
  const [date, setDate] = useState(null);
  const [movies, setMovies] = useState([]);
  const [singleMovie, setSingleMovie] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/soonmovies").then((response) => {
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
  };

  const getMovieById = (id) => {
    axios
      .get(`http://localhost:5000/soonmovies/${id}`)
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

  const handleDateSelect = (dateValue) => {
    setDate(dateValue);
  };
  const handleConfirm = () => {
    const confirmationNumber = Math.floor(Math.random() * 100000);
    alert(`Vaša oznaka za kupovinu karata je: ${confirmationNumber}`);
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setSelectedProjection(null);
    setDate(null);
    setShowConfirmation(false);
  };

  return (
    <div>
      <ul className='navbar'>
        <div>
          <li>
            <a href='/movies' data-hover='TOP FILMOVI'>
              TOP FILMOVI
            </a>
          </li>
          <li className='current'>
            <a href='#' data-hover='USKORO U KINU'>
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
          USKORO U KINU
        </h4>
      </div>
      <div class='films-container'>
        <div class='film'>
          {movies.map((movie) => {
            return (
              <div className='filmovi'>
                <img
                  src={movie.image}
                  alt='movie'
                  className='img-card col-lg-4 col-md-6 col-sm-12 col-12'
                  style={{ maxWidth: 250, width: "90%" }}
                  onClick={() => handleImageClick(movie._id)}
                />
                <p class='movie-title'>{movie.title}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for selecting projection and date */}

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
          <div className='modal-dialog' style={{ margin: "10% auto", maxWidth: 600 }}>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Potvrda kupovine karata</h5>
                <button type='button' className='close' onClick={handleCancel}>
                  <span aria-hidden='true'>×</span>
                </button>
              </div>
              <div className='modal-body'>
                <div className='form-group'>
                  <label htmlFor='projectionSelect'>Projekcija:</label>
                  <h3 className='mb-4 mt-4'>Odabrali ste film: {singleMovie?.title}</h3>
                  <h3 className='soon-text'>FILM USKORO U KINU</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Movies;
