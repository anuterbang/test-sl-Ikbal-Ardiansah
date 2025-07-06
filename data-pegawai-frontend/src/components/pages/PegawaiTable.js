import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Stack, Paper, Typography, MenuItem,
    CircularProgress, Alert
} from '@mui/material';
import axios from './axiosWithAuth'; // sesuaikan dengan file axios-mu

const PegawaiForm = ({ selected, onSuccess, onCancel }) => {
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Ambil departemen
    useEffect(() => {
        axios.get('/departments')
            .then(res => setDepartments(res.data))
            .catch(() => setDepartments([]));
    }, []);

    // Ambil semua posisi
    useEffect(() => {
        axios.get('/positions')
            .then(res => {
                setPositions(res.data);
            })
            .catch(() => {
                setPositions([]);
            });
    }, []);

    // Isi form untuk edit atau generate NIP untuk tambah
    useEffect(() => {
        if (selected) {
            setForm({
                nip: selected.nip || '',
                name: selected.name || '',
                email: selected.email || '',
                phone_number: selected.phone_number || '',
                address: selected.address || '',
                department_id: selected.department_id || '',
                position_id: '', // Kosong dulu, isi setelah posisi sudah di-load
                hire_date: selected.hire_date ? selected.hire_date.substring(0, 10) : '',
            });
        } else {
            axios.get('/nip/generate')
                .then(res => {
                    setForm(prev => ({ ...prev, nip: res.data?.nip || '' }));
                })
                .catch(() => {
                    setForm(prev => ({ ...prev, nip: '' }));
                });
        }
    }, [selected]);

    // Setelah posisi siap, set position_id jika valid
    useEffect(() => {
        if (positions.length > 0 && selected?.position_id) {
            const valid = positions.some(p => p.id === selected.position_id);
            if (valid) {
                setForm(prev => ({ ...prev, position_id: selected.position_id }));
            }
        }
    }, [positions, selected]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'position_id') {
            const selectedPosition = positions.find(p => p.id === parseInt(value));
            setForm(prev => ({
                ...prev,
                position_id: value,
                job_title_id: selectedPosition?.job_title_id || '', // ➕ isi otomatis
            }));
        } else if (name === 'department_id') {
            setForm(prev => ({ ...prev, department_id: value, position_id: '', job_title_id: '' }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const apiCall = selected
            ? axios.put(`/employees/${selected.id}`, form)
            : axios.post('/employees', form);

        apiCall.then(() => {
            setLoading(false);
            if (onSuccess) onSuccess();
        }).catch(err => {
            setLoading(false);
            setError('Gagal menyimpan data pegawai.');
            console.error(err);
        });
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 600, margin: 'auto' }}>
            <Typography variant="h6" mb={2}>
                {selected ? 'Edit Pegawai' : 'Tambah Pegawai'}
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField
                        label="NIP"
                        name="nip"
                        value={form.nip}
                        onChange={handleChange}
                        fullWidth
                        disabled
                    />

                    <TextField
                        label="Nama"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        label="Telepon"
                        name="phone_number"
                        value={form.phone_number}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        label="Alamat"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        fullWidth
                    />

                    <TextField
                        label="Departemen"
                        name="department_id"
                        select
                        value={form.department_id}
                        onChange={handleChange}
                        fullWidth
                    >
                        <MenuItem value="">-- Pilih Departemen --</MenuItem>
                        {departments.map(d => (
                            <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Posisi"
                        name="position_id"
                        select
                        value={positions.some(p => p.id === form.position_id) ? form.position_id : ''}
                        onChange={handleChange}
                        fullWidth
                        SelectProps={{
                            MenuProps: { disablePortal: true }
                        }}
                    >
                        <MenuItem value="">-- Pilih Posisi --</MenuItem>
                        {positions.length === 0 ? (
                            <MenuItem disabled>Loading posisi...</MenuItem>
                        ) : (
                            positions.map(p => (
                                <MenuItem key={p.id} value={p.id}>{p.title}</MenuItem>
                            ))
                        )}
                    </TextField>

                    <TextField
                        label="Tanggal Masuk"
                        name="hire_date"
                        type="date"
                        value={form.hire_date}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button onClick={onCancel} disabled={loading}>Batal</Button>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Simpan'}
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Paper>
    );
};

export default PegawaiForm;
