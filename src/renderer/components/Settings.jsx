import React, { useState } from 'react';
import ContactS from './ContactS';
import LanguageS from './LanguageS';
import AccountS from './AccountS';
import { useTranslation } from 'react-i18next';

const SettingsModal = ({ onAccount, onLanguage, onContact, onCancel, isLoggedIn, userId, setUser }) => {
    const { t } = useTranslation();

    // settings screen state
    const [currentScreen, setCurrentScreen] = useState('menu');

    return (
        <div className="modal-overlay">
            <div className={`modal-content-buttonME ${currentScreen === 'contact' ? 'modal-wide' : ''}`}>  
                {currentScreen === 'menu' ? ( 
                    <div className="modal-buttons-container">
                        <button className={`btn-modal-exit ${!isLoggedIn ? 'btn-disabled' : ''}`} disabled={!isLoggedIn} onClick={() => setCurrentScreen('account')}>{t('settings.account')}</button>
                        <button className="btn-modal-exit" onClick={() => setCurrentScreen('language')}>{t('settings.language')}</button>
                        <button className="btn-modal-exit" onClick={() => setCurrentScreen('contact')}>{t('settings.contact')}</button>
                        <button className="btn-modal-exit btn-back" onClick={onCancel}>{t('settings.back')}</button>
                    </div>
                ) : currentScreen === 'account' ? (
                        /* Abre a página do AccountS dentro do próprio modal */
                        <AccountS 
                            onBack={() => setCurrentScreen('menu')} 
                            userId={userId} 
                            setUser={setUser} 
                        />
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