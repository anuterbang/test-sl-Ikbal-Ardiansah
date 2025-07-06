// File: src/components/pages/PegawaiForm.js
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Container,
    Grid,
    MenuItem,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import axios from './axiosWithAuth';
import { useNavigate, useParams } from 'react-router-dom';

const PegawaiForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState({
        nip: '',
        name: '',
        email: '',
        phone_number: '',
        address: '',
        department_id: '',
        position_id: '',
        job_title_id: '',
        hire_date: '',
    });

    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [jobTitles, setJobTitles] = useState([]);
    const [notif, setNotif] = useState({ open: false, message: '', severity: 'success' });
    const [emailError, setEmailError] = useState('');

    const checkEmail = async (email) => {
        if (!email || !email.includes('@') || !email.includes('.')) {
            setEmailError('Masukkan email yang valid');
            return;
        }

        try {
            const res = await axios.post('/employees/check-email', {
                email,
                exclude_id: id || null,
            });

            if (res.data.exists) {
                setEmailError('Email sudah terdaftar');
            } else {
                setEmailError('');
            }
        } catch (err) {
            console.error('Gagal cek email:', err);
            console.log('Detail Laravel:', err.response?.data);
            setEmailError('Gagal mengecek email');
        }
    };


    useEffect(() => {
        if (form.department_id) {
            axios.get(`/positions?department_id=${form.department_id}`)
                .then(res => setPositions(res.data))
                .catch(() => setPositions([]));
        } else {
            setPositions([]);
        }
    }, [form.department_id]);

    useEffect(() => {
        axios.get('/departments')
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : res.data.data || [];
                setDepartments(data);
            })
            .catch(err => {
                console.error('Gagal fetch departments:', err.response?.data || err.message);
            });
    }, []);

    useEffect(() => {
        if (form.department_id) {
            axios.get(`/positions?department_id=${form.department_id}`)
                .then(res => {
                    const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
                    setPositions(data);
                })
                .catch(() => {
                    setPositions([]);
                });
        } else {
            setPositions([]);
        }
    }, [form.department_id]);


    useEffect(() => {
        axios.get('/job_titles')
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
                setJobTitles(data);
            })
            .catch(err => {
                console.error('Gagal fetch job titles:', err.response?.data || err.message);
            });
    }, []);

    useEffect(() => {
        const selectedPosition = positions.find(p => p.id === parseInt(form.position_id));
        console.log('Selected position:', selectedPosition); // debug

        if (selectedPosition?.job_title_id) {
            setForm(prev => ({
                ...prev,
                job_title_id: selectedPosition.job_title_id
            }));
        } else {
            setForm(prev => ({ ...prev, job_title_id: '' }));
        }
    }, [form.position_id, positions]);



    useEffect(() => {
        if (!id) {
            axios.get('/nip/generate')
                .then(res => {
                    console.log('NIP generated:', res.data); // cek apakah nip benar
                    setForm(prev => ({ ...prev, nip: res.data?.nip || '' }));
                })
                .catch((err) => {
                    console.error('Error fetching NIP:', err); // ✅ err sekarang valid
                });
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            axios.get(`/employees/${id}`)
                .then(res => {
                    const data = res.data;
                    setForm({
                        nip: data.nip || '',
                        name: data.name || '',
                        email: data.email || '',
                        phone_number: data.phone_number || '',
                        address: data.address || '',
                        department_id: data.department_id || '',
                        position_id: data.position_id || '',
                        job_title_id: data.job_title_id || '',
                        hire_date: data.hire_date || '',
                    });
                })
                .catch(err => {
                    console.error('Gagal fetch detail pegawai:', err.response?.data || err.message);
                    setNotif({ open: true, message: 'Gagal memuat data pegawai', severity: 'error' });
                });
        }
    }, [id]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'department_id' ? { position_id: '' } : {}),
        }));
        if (name === 'email') {
            checkEmail(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const request = id
            ? axios.put(`/employees/${id}`, form)
            : axios.post('/employees', form);


        request.then(() => {
            setNotif({ open: true, message: 'Berhasil disimpan', severity: 'success' });
            setTimeout(() => navigate('/pegawai'), 1500);
        }).catch(() => {
            setNotif({ open: true, message: 'Gagal menyimpan', severity: 'error' });
        });
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
                {id ? 'Edit Pegawai' : 'Tambah Pegawai'}
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField label="NIP" name="nip" value={form.nip} fullWidth disabled />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Nama" name="name" value={form.name} onChange={handleChange} fullWidth required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            fullWidth
                            type="email"
                            required
                            error={!!emailError}
                            helperText={emailError}
                        />

                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Telepon" name="phone_number" value={form.phone_number} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Alamat" name="address" value={form.address} onChange={handleChange} fullWidth multiline rows={2} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Departemen"
                            name="department_id"
                            value={form.department_id}
                            onChange={handleChange}
                            fullWidth
                            required
                        >
                            <MenuItem value="">Pilih Departemen</MenuItem>
                            {departments.map(dep => (
                                <MenuItem key={dep.id} value={dep.id}>{dep.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Posisi"
                            name="position_id"
                            value={form.position_id}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={!form.department_id}
                        >
                            <MenuItem value="">Pilih Posisi</MenuItem>
                            {positions.map(pos => (
                                <MenuItem key={pos.id} value={pos.id}>{pos.title}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Job Title"
                            name="job_title_id"
                            value={form.job_title_id}
                            onChange={handleChange}
                            fullWidth
                            required
                        >
                            <MenuItem value="">Pilih Jabatan</MenuItem>
                            {jobTitles.map((jt) => (
                                <MenuItem key={jt.id} value={jt.id}>{jt.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            type="date"
                            label="Tanggal Masuk"
                            name="hire_date"
                            value={form.hire_date}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!!emailError}
                            >
                                {id ? 'Update' : 'Simpan'}
                            </Button>

                            <Button variant="outlined" color="inherit" onClick={() => navigate('/pegawai')}>Batal</Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Snackbar
                open={notif.open}
                autoHideDuration={3000}
                onClose={() => setNotif({ ...notif, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={notif.severity} onClose={() => setNotif({ ...notif, open: false })}>
                    {notif.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default PegawaiForm;
