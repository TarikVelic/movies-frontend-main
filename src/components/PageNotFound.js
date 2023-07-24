import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import error from "./images/error.png";

const PageNotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Page Not Found";
  }, []);

  return (
    <div style={{ overflow: "hidden" }}>
      <img
        src={error}
        alt='Page Not Found'
        style={{
          objectFit: "cover",
          width: "100vw",
          height: "100vh",
          margin: 0,
          padding: 0,
        }}
      />
    </div>
  );
};

export default PageNotFound;
