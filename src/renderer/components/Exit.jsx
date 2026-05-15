import React from 'react';

const ExitModal = ({ onCancel, onLogout, onExit }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content-buttonME">
        <div className="modal-buttons-container">
          <button className="btn-modal-exit" onClick={onLogout}>Logout</button>
          <button className="btn-modal-exit" onClick={onExit}>Exit App</button>
          <button className="btn-modal-exit btn-back" onClick={onCancel}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default ExitModal;
