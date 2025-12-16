import React from "react";
import { Spinner as BootstrapSpinner } from "react-bootstrap";

const Spinner = ({ message = "Loading...", size = "lg" }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <BootstrapSpinner
        animation="border"
        role="status"
        size={size}
        className="mb-3"
      >
        <span className="visually-hidden">Loading...</span>
      </BootstrapSpinner>
      {message && <p className="text-muted">{message}</p>}
    </div>
  );
};

export default Spinner;
