import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    Alert
} from '@mui/material';
import axios from './axiosWithAuth';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const Pegawai = () => {
    const [employees, setEmployees] = useState([]);
    const [notif, setNotif] = useState({ open: false, message: '', severity: 'success' });
    const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });
    const navigate = useNavigate();

    const fetchData = () => {
        axios.get('/employees')
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : res.data.data;
                setEmployees(data);
            })
            .catch(() => setEmployees([]));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getJabatanColor = (jabatan) => {
        switch (jabatan?.toLowerCase()) {
            case 'staff': return 'info';
            case 'manager': return 'warning';
            case 'intern': return 'default';
            case 'ceo': return 'error';
            default: return 'secondary'; // fallback warna
        }
    };


    const getNip = (nip) => {
        return typeof nip === 'object' && nip !== null ? nip.nip : nip;
    };

    const handleDeleteConfirm = (id) => {
        setConfirmDialog({ open: true, id });
    };

    const handleDelete = () => {
        axios.delete(`/employees/${confirmDialog.id}`)
            .then(() => {
                fetchData();
                setNotif({ open: true, message: 'Pegawai berhasil dihapus.', severity: 'success' });
            })
            .catch(() => {
                setNotif({ open: true, message: 'Gagal menghapus pegawai.', severity: 'error' });
            })
            .finally(() => {
                setConfirmDialog({ open: false, id: null });
            });
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Card elevation={3}>
                <CardContent>
                    <Stack direction="row" justifyContent="space-between" mb={2}>
                        <Typography variant="h5" fontWeight="bold">
                            <PeopleAltIcon sx={{ mb: '-4px', mr: 1 }} /> Data Pegawai
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Button variant="contained" onClick={() => navigate('/pegawai/form')}>
                                Tambah Pegawai
                            </Button>
                            <Chip label={`Total: ${employees.length}`} color="primary" />
                        </Stack>
                    </Stack>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell>Avatar</TableCell>
                                    <TableCell>NIP</TableCell>
                                    <TableCell>Nama</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Telepon</TableCell>
                                    <TableCell>Alamat</TableCell>
                                    <TableCell>Departemen</TableCell>
                                    <TableCell>Posisi</TableCell>
                                    <TableCell>Jabatan</TableCell>
                                    <TableCell>Tgl Masuk</TableCell>
                                    <TableCell align="center">Aksi</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employees.map(emp => (
                                    <TableRow key={emp.id}>
                                        <TableCell><Avatar>{emp.name?.charAt(0)}</Avatar></TableCell>
                                        <TableCell>{getNip(emp.nip)}</TableCell>
                                        <TableCell>{emp.name}</TableCell>
                                        <TableCell>{emp.email}</TableCell>
                                        <TableCell>{emp.phone_number}</TableCell>
                                        <TableCell>{emp.address}</TableCell>
                                        <TableCell>
                                            <Chip label={emp.department?.name || '-'} size="small" color="info" />
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={emp.position?.title || '-'} size="small" color="secondary" />
                                        </TableCell>
                                        <TableCell>
                                            {emp.job_title?.name ? (
                                                <Chip
                                                    label={emp.job_title.name}
                                                    color={getJabatanColor(emp.job_title.name)}
                                                    size="small"
                                                    variant="filled"
                                                />
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>

                                        <TableCell>{emp.hire_date}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    color="warning"
                                                    size="small"
                                                    onClick={() => navigate(`/pegawai/form/${emp.id}`)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Hapus">
                                                <IconButton color="error" size="small" onClick={() => handleDeleteConfirm(emp.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {employees.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center">Tidak ada data pegawai.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Snackbar Notifikasi */}
            <Snackbar
                open={notif.open}
                autoHideDuration={3000}
                onClose={() => setNotif({ ...notif, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={notif.severity} variant="filled" onClose={() => setNotif({ ...notif, open: false })}>
                    {notif.message}
                </Alert>
            </Snackbar>

            {/* Dialog Konfirmasi Hapus */}
            <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, id: null })}>
                <DialogTitle>Konfirmasi Hapus</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Yakin ingin menghapus data pegawai ini? Tindakan ini tidak dapat dibatalkan.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialog({ open: false, id: null })}>Batal</Button>
                    <Button color="error" onClick={handleDelete}>Hapus</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Pegawai;
