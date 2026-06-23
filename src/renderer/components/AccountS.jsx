import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Check } from 'lucide-react';
const { ipcRenderer } = window.require('electron');

const validateEmail = (emailToTest) => {
  if (!emailToTest) return false;
  const cleanEmail = emailToTest.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleanEmail);
};

const AccountS = ({ onBack, userId, setUser }) => {
    const { t } = useTranslation();

    console.log("componente pai:", userId);

    const [email, setEmail] = useState('');
    const [isEditingEmail, setIsEditingEmail] = useState(false);

    useEffect(() => {
        if (!userId) return;

        if (typeof userId === 'object') {
            setEmail(userId.email || userId.user_email || '');
        } else if (typeof userId === 'string' && userId.includes('@')) {
            setEmail(userId);
        }
    }, [userId]);

    // click pencil
    const handleStartEditEmail = () => {
        setIsEditingEmail(true);
    };

    // click check
    const handleSaveEmail = async () => {
        if (!validateEmail(email)) {
            alert(t('warning.invalid-email-format', 'formato de email inválido!'));
            return;
        }

        const cleanEmail = email.trim();
        
        // to find what email is saved at the moment
        const currentEmail = typeof userId === 'object' ? (userId.email || userId.user_email) : '';

        // if same email, nothing happens
        if (cleanEmail === currentEmail?.trim()) {
            setIsEditingEmail(false); // back to pencil
            return; // doesn't go to DB nor does the logout
        }

        const mensagemAviso = t('account.logout-warning');

        // if new email, warns user about the change & logout
        const confirmar = window.confirm(t(mensagemAviso));

        // if cancel, stops process and go back to editing the field
        if (!confirmar) {
            return;
        }

        // if ok, saves it in DB
        try {
            const targetId = typeof userId === 'object' ? userId.id : userId;

            console.log("A enviar novo email para o Electron...", { id: targetId, email: cleanEmail });

            const updatedUser = await ipcRenderer.invoke('update-user-email', { 
                id: targetId, 
                email: cleanEmail 
            });
            
            if (setUser) {
                setUser(updatedUser || { ...userId, email: cleanEmail });
            }
            
            setIsEditingEmail(false); 
            alert(t('account.email-updated'));

        } catch (error) {
            console.error("Erro fatal ao gravar na BD:", error);
            alert(t('account.email-exists'));
            setIsEditingEmail(true); 
        }
    };

    return (
        <div className="settings-account-container">
            <div className="account-title" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                {t('account.title', 'account')}
            </div>

            <div className="account-form-grid">
                <div className="account-field-group">
                    <label className="account-label">{t('login.email')}</label>
                    <div className="account-input-wrapper" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                            type="email"
                            value={email}
                            disabled={!isEditingEmail}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`account-input ${isEditingEmail ? 'editable' : 'disabled'}`}
                        />
                        {isEditingEmail ? (
                            <button className="account-action-btn check-btn" onClick={handleSaveEmail}>
                                <Check size={18} />
                            </button>
                        ) : (
                            <button className="account-action-btn pencil-btn" onClick={() => setIsEditingEmail(true)}>
                                <Pencil size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <button className="btn-modal-exit btn-back" onClick={onBack} style={{ marginTop: '20px' }}>
                {t('account.back', 'back')}
            </button>
        </div>
    );
};

export default AccountS;