import { useState } from 'react';
import ExitModal from '../components/Exit';

const useAppControls = (userId, setUser) => {    
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleLogout = () => {
        setIsModalOpen(false);
        setUser(null); // clears user and goes back to Login page
    };

    const handleExit = () => {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('force-close');
        } else {
            // if fails, closes normally
            window.close();
        }
    };

    return {
        isModalOpen, // variable
        setIsModalOpen,
        minimizeApp,
        closeApp,
        handleExit,
        handleLogout
    };
};

export default useAppControls;