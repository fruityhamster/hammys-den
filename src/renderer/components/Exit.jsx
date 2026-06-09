import React from 'react';
import { useTranslation } from 'react-i18next';

const ExitModal = ({ onCancel, onLogout, onExit }) => {

  const { t } = useTranslation();

  return (
    <div className="modal-overlay">
      <div className="modal-content-buttonME">
        <div className="modal-buttons-container">
          <button className="btn-modal-exit" onClick={onLogout}>{t('exit.logout')}</button>
          <button className="btn-modal-exit" onClick={onExit}>{t('exit.exit-app')}</button>
          <button className="btn-modal-exit btn-back" onClick={onCancel}>{t('exit.back')}</button>
        </div>
      </div>
    </div>
  );
};

export default ExitModal;
