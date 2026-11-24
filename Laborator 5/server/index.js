// Serverul City Explorer: Express + MariaDB.
// Se pornește din directorul server cu: npm run dev
import express from 'express'
import cors from 'cors'
import { pool } from './db.js'
import { jurnal } from './jurnal.js'
import statistici from './rute/statistici.js'
import raportJurnal from './rute/jurnal.js'

const app = express()

// Fișa, pregătirea instrumentelor: tipărește fiecare cerere primită
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl)
  next()
})

// Exercițiul 4d: jurnalul stă ÎNAINTEA lui cors(). cors() răspunde singur
// la cererile OPTIONS (204) și nu mai apelează next(), deci un jurnal pus
// după el nu le-ar vedea niciodată.
app.use(jurnal)
app.use(cors())          // permite paginii (portul 5173) să folosească răspunsul
app.use(express.json())  // citește corpul cererilor POST și PATCH în req.body

// MariaDB dă id-ul ca număr și BOOLEAN ca 0/1; interfața așteaptă șir și true/false
function converteste(d) {
  return { ...d, id: String(d.id), vizitat: Boolean(d.vizitat) }
}

// Exercițiul 1b: toate destinațiile, ordonate după id
app.get('/api/destinatii', async (req, res) => {
  const [randuri] = await pool.query(
    'SELECT id, oras, tara, zile, vizitat FROM destinatii ORDER BY id',
  )

  res.json(randuri.map(converteste))
})

// Exercițiul 5a: căutare exactă după oraș, cu parametru
app.get('/api/destinatii/caut', async (req, res) => {
  const oras = req.query.oras ?? ''

  const [randuri] = await pool.query(
    'SELECT id, oras, tara, zile, vizitat FROM destinatii WHERE oras = ?',
    [oras],
  )

  res.json(randuri.map(converteste))
})

// Exercițiul 2: adăugarea unei destinații, cu validare pe server
app.post('/api/destinatii', async (req, res) => {
  const { oras, tara, zile } = req.body

  const orasBun = typeof oras === 'string' && oras.trim() !== ''
  const taraBuna = typeof tara === 'string' && tara.trim() !== ''
  // Number.isInteger("3") este false: un șir nu trece, chiar dacă arată ca un număr
  const zileBune = Number.isInteger(zile) && zile >= 1 && zile <= 30

  if (!orasBun || !taraBuna || !zileBune) {
    // return: fără el execuția ar continua și ar încerca să răspundă a doua oară
    return res.status(400).json({ eroare: 'Date invalide.' })
  }

  const [rezultat] = await pool.query(
    'INSERT INTO destinatii (oras, tara, zile, vizitat) VALUES (?, ?, ?, ?)',
    [oras.trim(), tara.trim(), zile, false],
  )

  res.status(201).json({
    id: String(rezultat.insertId),
    oras: oras.trim(),
    tara: tara.trim(),
    zile,
    vizitat: false,
  })
})

// Exercițiul 3a: schimbă doar câmpul vizitat
app.patch('/api/destinatii/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { vizitat } = req.body

  if (typeof vizitat !== 'boolean') {
    return res.status(400).json({ eroare: 'Câmpul vizitat trebuie să fie true sau false.' })
  }

  const [rezultat] = await pool.query('UPDATE destinatii SET vizitat = ? WHERE id = ?', [
    vizitat,
    id,
  ])

  // 0 rânduri atinse = nu există destinația, deci 404, nu 200
  if (rezultat.affectedRows === 0) {
    return res.status(404).json({ eroare: 'Destinația nu există.' })
  }

  const [randuri] = await pool.query(
    'SELECT id, oras, tara, zile, vizitat FROM destinatii WHERE id = ?',
    [id],
  )

  res.json(converteste(randuri[0]))
})

// Exercițiul 1c: ruta temporară de ecou, pentru punctul 1 al fișei
app.all('/api/ecou/:id', (req, res) => {
  res.json({ params: req.params, query: req.query, body: req.body })
})

// Exercițiul 3c și 4b: rutele din fișiere separate
app.use('/api/statistici', statistici)
app.use('/api/jurnal', raportJurnal)

const PORT = Number(process.env.PORT) || 3000

app.listen(PORT, () => {
  console.log(`API pornit pe http://localhost:${PORT}`)
})
