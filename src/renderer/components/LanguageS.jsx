import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageS = ({ onBack }) => {
  const { t, i18n } = useTranslation();

  // languages list with codes
  const availableLanguages = [
    { code: 'en', name: 'english' },
    { code: 'pt', name: 'português' },
    { code: 'es', name: 'español' },
    { code: 'fr', name: 'français' },
    { code: 'it', name: 'italiano' },
    { code: 'ko', name: '한국어' }
  ];

  return (
    <div className="settings-language-container">
      {/* use json keys instead of normal text */}
      <div className="language-title">{t('language.title')}</div>

      {/* column for the languages buttons */}
      <div className="language-grid">
        {availableLanguages.map((lang) => (
          <button
            key={lang.code}
            /* if selected language gets highlighted */
            className={`btn-lang-select ${i18n.language === lang.code ? 'active-lang' : ''}`}
            onClick={() => i18n.changeLanguage(lang.code)}>
            {lang.name}
          </button>
        ))}
      </div>

      <button className="btn-modal-exit btn-back" onClick={onBack}>{t('language.back')}</button>
    </div>
  );
};

export default LanguageS;