// src/components/FloatingLogout.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Fab, Snackbar, Alert, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';


const FloatingLogout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setOpen(true);
        setTimeout(() => navigate('/login'), 1000);
    };

    if (location.pathname === '/login') return null;

    return (
        <>
            <Tooltip title="Logout">
                <Fab
                    color="error"
                    onClick={handleLogout}
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        zIndex: 9999,
                    }}
                >
                    <LogoutIcon />
                </Fab>
            </Tooltip>

            <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled">
                    Berhasil logout!
                </Alert>
            </Snackbar>
        </>
    );
};

export default FloatingLogout;
