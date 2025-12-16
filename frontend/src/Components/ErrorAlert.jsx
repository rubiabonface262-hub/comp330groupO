import React from "react";
import { Alert, Button } from "react-bootstrap";

const ErrorAlert = ({ error, onRetry, onClose, showCloseButton = true }) => {
  if (!error) return null;

  return (
    <Alert
      variant="danger"
      className="d-flex align-items-center justify-content-between"
    >
      <div className="d-flex align-items-center">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        <span>{error}</span>
      </div>
      <div>
        {onRetry && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={onRetry}
            className="me-2"
          >
            Retry
          </Button>
        )}
        {showCloseButton && onClose && (
          <Button variant="danger" size="sm" onClick={onClose}>
            <i className="bi bi-x"></i>
          </Button>
        )}
      </div>
    </Alert>
  );
};

export default ErrorAlert;
