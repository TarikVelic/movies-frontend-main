import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/login_component";
import SignUp from "./components/signup_component";
import PageNotFound from "./components/PageNotFound";
import Movies from "./components/movies";
import SoonMovies from "./components/soonmovies";

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  return (
    <Router>
      <div className='App'>
        <ToastContainer />
        <Routes>
          <Route exact path='/' element={isLoggedIn === "true" ? <Movies /> : <Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/movies' element={<Movies />} />
          <Route path='/soonmovies' element={<SoonMovies />} />
          <Route path='/*' element={<PageNotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
