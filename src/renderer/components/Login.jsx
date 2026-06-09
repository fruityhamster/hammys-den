import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';
import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SettingsModal from '../components/Settings';
import useAppControls2 from '../components/ButtonS';
const { ipcRenderer } = window.require('electron');

const Login = ({ onLoginSuccess, userId, setUser }) => {

    //ButtonS
    const {
        isSettingsOpen, // variable
        setIsSettingsOpen,
        handleAccount,
        handleLanguage,
        handleContact
    } = useAppControls2();

    const { t } = useTranslation();

    const [view, setView] = useState('welcome'); // 'welcome' ou 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false); // show password
    const [rememberMe, setRememberMe] = useState(false); // remember login

    // function for rule validation (Regex)
    const validateFields = () => {
        // if empty
        if (!email || !password || (view === 'signup' && !name)) {
            return "make sure to fill all the fields";
        }

        // email (@ and .)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "invalid email format (missing @ or . )";
        }

        // password (only for sign up)
        if (view === 'signup') {
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~]).{12,}$/;
            if (!passwordRegex.test(password)) {
                return "password must have: 12+ chars, 1 uppercase, 1 number and 1 special char";
            }
        }
        return null; // everything ok
    };

    const handleAuth = async () => {
        const validationError = validateFields();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);

        try {
            if (view === 'signup') {
                // new account
                await ipcRenderer.invoke('auth-signup', { name, email, password });
                setView('welcome'); // back to login after creating new account
                setPassword(''); // clear password
            } else {
                // login
                const user = await ipcRenderer.invoke('auth-login', { email, password });
                if (user) {
                    // remember login
                    if (rememberMe) {
                        // saves the object as string in the PC
                        localStorage.setItem('savedUser', JSON.stringify(user));
                    } else {
                        // if not checked, make sure there's nothing in there
                        localStorage.removeItem('savedUser');
                    }

                    onLoginSuccess(user);
                } else {
                    setError("access denied, try again");
                }
            }
        }   catch (err) {
            setError("access denied,  try again");
        }
    };

    // function to clear all fields
    const resetFields = () => {
        setEmail('');
        setPassword('');
        setName('');
        setError(null);
        setShowPassword(false);
    };

    // minimize app
    const minimizeApp = () => {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            // wait for animation
            setTimeout(() => {
                ipcRenderer.send('minimize-app');
            }, 150);
        } else {
            console.warn("Electron IPC não encontrado");
        };
    };

    // exit button
    const closeApp = () => {
        // if the user is in login/sign up, it closes
        if (!userId) {
            setTimeout(() => {
                window.close();
            }, 150);
        } else {
            // if the user is logged in, shows modal
            setIsModalOpen(true);
        }
    };

    return (
        <div className="app-container" >
            {/* superior bar (draggable) */}
            <div className="flex justify-between items-center mb-6" >
                <div className="main-title" style={{ WebkitAppRegion: 'drag' }}>hammy's den &lt;3</div>
                {/* buttons min&close (not draggable) */}
                <div className="flex gap-1" style={{ WebkitAppRegion: 'no-drag' }}>
                    {/* settings button */}
                    <button className="min-close-buttons settings-top-btn" onClick={() => setIsSettingsOpen(true)}>
                        <Settings className="settings-icon" />
                    </button>
                    <button className="min-close-buttons" onClick={minimizeApp}>_</button>
                    <button className="min-close-buttons" onClick={closeApp}>x</button>
                </div>
            </div>

            <div className="base-background"></div>

            {/* page title: welcome! / creating new account! */}
            <h2 className="page-title">{view === 'welcome' ? 'welcome!' : 'creating new account'}</h2>

            <div className="auth-box">
                {/* name field (sign up) */}
                {view === 'signup' && (
                    <div className="auth-input-group">
                        <label className="auth-label">name:</label>
                        <input 
                            className="auth-input" 
                            type="text" 
                            placeholder="Hammy"
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>
                )}

                {/* email field */}
                <div className="auth-input-group">
                    <label className="auth-label">email:</label>
                    <input 
                        className="auth-input" 
                        type="email" 
                        placeholder="hammy@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.toLowerCase())} // lower case for email
                    />
                </div>

                {/* password field */}
                <div className="auth-input-group">
                    <label className="auth-label">password:</label>
                    <div className="password-group">
                        <input 
                            className="auth-input" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button 
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <Eye/> : <EyeOff/>}
                        </button>
                    </div>
                </div>

                {/* checkbox remember login */}
                {view === 'welcome' && (
                    <div className="auth-input-group" >
                        <div className="remember-me-container">
                            <input type="checkbox" id="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                            <label htmlFor="remember" className="auth-label">keep me logged in</label>
                        </div>
                    </div>
                )}

                {/* warnings */}
                {error && (
                    <div className="warning-section">
                        <p className="warning-title">warning:</p>
                        <p> &gt; {error}</p>
                    </div>
                )}     
            </div>

            <div className="button-group">
                {view === 'welcome' ? (
                    <>
                        <button className="button-left" onClick={() => { resetFields(); setView('signup'); setError(null); }}>sign up</button>
                        <button className="button-right" onClick={handleAuth}>login</button>
                    </>
                ) : (
                    <>
                        <button className="button-left" onClick={handleAuth}>create</button>
                        <button className="button-right" onClick={() => { resetFields(); setView('welcome'); setError(null); }}>back</button>
                    </>
                )}
            </div>

            {/* Settings Modal */}
            {isSettingsOpen && (
                <SettingsModal 
                onCancel={() => setIsSettingsOpen(false)} 
                onAccount={handleAccount}
                onLanguage={handleLanguage}
                onContact={handleContact}
                />
            )}
        </div>
    );
};

export default Login;