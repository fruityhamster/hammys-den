import React from 'react';
import { Mail, FolderGit } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ContactS = ({ onBack }) => {
  const { t } = useTranslation();

  // to open GitHub link (Electron browser) 
  const openGitHub = (e) => {
      e.preventDefault();
      window.open('https://github.com/fruityhamster/hammys-den', '_blank');
  };

  return (
    <div className="settings-contact-container">
      <div className="contact-title">{t('contact.title')}</div>
      
      <div className="contact-info-box">
        <p className="contact-label">{t('contact.subtittle1')}</p>
        <span className="contact-value"><Mail/>hammys.contact@gmail.com</span>
      </div>

      <div className="contact-info-box">
        <p className="contact-label">{t('contact.subtittle2')}</p>
        <button className="btn-github-link" onClick={openGitHub}><FolderGit/>https://github.com/fruityhamster/hammys-den</button>
      </div>

      <button className="btn-modal-exit btn-back" onClick={onBack}>{t('contact.back')}</button>
    </div>
  );
};

export default ContactS;