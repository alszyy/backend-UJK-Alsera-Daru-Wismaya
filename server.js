const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Halaman utama
app.get('/', (req, res) => {
    res.send('Backend Data Siswa Berhasil Berjalan!');
});

// 1. GET - Menampilkan semua siswa
app.get('/api/siswa', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM siswa ORDER BY kode_siswa ASC'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. GET - Menampilkan siswa berdasarkan kode
app.get('/api/siswa/:kode_siswa', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM siswa WHERE kode_siswa = ?',
            [req.params.kode_siswa]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: 'Data siswa tidak ditemukan'
            });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. POST - Menambahkan siswa
app.post('/api/siswa', async (req, res) => {
    try {
        const {
            kode_siswa,
            nama_siswa,
            alamat_siswa,
            tgl_siswa,
            jurusan_siswa
        } = req.body;

        if (!kode_siswa || !nama_siswa || !alamat_siswa ||
            !tgl_siswa || !jurusan_siswa) {
            return res.status(400).json({
                message: 'Semua data siswa wajib diisi'
            });
        }

        await db.query(
            `INSERT INTO siswa
            (kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa)
            VALUES (?, ?, ?, ?, ?)`,
            [kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa]
        );

        res.status(201).json({
            message: 'Data siswa berhasil ditambahkan'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4. PUT - Mengedit data siswa
app.put('/api/siswa/:kode_siswa', async (req, res) => {
    try {
        const {
            nama_siswa,
            alamat_siswa,
            tgl_siswa,
            jurusan_siswa
        } = req.body;

        const [result] = await db.query(
            `UPDATE siswa SET
            nama_siswa = ?,
            alamat_siswa = ?,
            tgl_siswa = ?,
            jurusan_siswa = ?
            WHERE kode_siswa = ?`,
            [
                nama_siswa,
                alamat_siswa,
                tgl_siswa,
                jurusan_siswa,
                req.params.kode_siswa
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Data siswa tidak ditemukan'
            });
        }

        res.json({ message: 'Data siswa berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 5. DELETE - Menghapus siswa
app.delete('/api/siswa/:kode_siswa', async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM siswa WHERE kode_siswa = ?',
            [req.params.kode_siswa]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Data siswa tidak ditemukan'
            });
        }

        res.json({ message: 'Data siswa berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Menjalankan server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Backend berjalan di http://localhost:${PORT}`);
});
