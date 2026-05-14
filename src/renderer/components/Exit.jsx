import React from 'react';

const ExitModal = ({ onCancel, onLogout, onExit }) => {
  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={onLogout} style={{...buttonStyle, backgroundColor: '#3d1f18', color: '#fff8e1', fontSize: '24px', fontFamily: 'Pixelify Sans'}}>Logout</button>
          <button onClick={onExit} style={{ ...buttonStyle, backgroundColor: '#3d1f18', color: '#fff8e1', fontSize: '24px', fontFamily: 'Pixelify Sans'}}>Exit App</button>
          <button onClick={onCancel} style={{ ...buttonStyle, backgroundColor: '#3d1f18', color: '#fff8e1', fontSize: '24px', fontFamily: 'Pixelify Sans' }}>Back</button>
        </div>
      </div>
    </div>
  );
};

// Estilos rápidos (podes passar para o teu CSS depois)
const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0,0,0,0.25)', display: 'flex', justifyContent: 'center',
  alignItems: 'center', zIndex: 9999, borderRadius: '20px'
};

const modalContentStyle = {
  backgroundColor: '#6d4c41', padding: '30px', borderRadius: '20px',
  textAlign: 'center', width: '250px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
};

const buttonStyle = {
  padding: '02px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold'
};

export default ExitModal;