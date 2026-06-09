import React, { useState } from 'react';
import ContactS from './ContactS';
import LanguageS from './LanguageS';
//import AccountS from './AccountS';
import { useTranslation } from 'react-i18next';

const SettingsModal = ({ onAccount, onLanguage, onContact, onCancel }) => {
    const { t } = useTranslation();

    // settings screen state
    const [currentScreen, setCurrentScreen] = useState('menu');

    return (
        <div className="modal-overlay">
            <div className={`modal-content-buttonME ${currentScreen === 'contact' ? 'modal-wide' : ''}`}>  
                {currentScreen === 'menu' ? ( 
                    <div className="modal-buttons-container">
                        <button className="btn-modal-exit" onClick={onAccount}>{t('settings.account')}</button>
                        <button className="btn-modal-exit" onClick={() => setCurrentScreen('language')}>{t('settings.language')}</button>
                        <button className="btn-modal-exit" onClick={() => setCurrentScreen('contact')}>{t('settings.contact')}</button>
                        <button className="btn-modal-exit btn-back" onClick={onCancel}>{t('settings.back')}</button>
                    </div>
                ) : currentScreen === 'contact' ? (
                        <ContactS onBack={() => setCurrentScreen('menu')} />
                ) : currentScreen === 'language' ? (
                        <LanguageS onBack={() => setCurrentScreen('menu')} />
                ) : null}
                
            </div>
        </div>
    );
};

export default SettingsModal;
