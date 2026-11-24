// Exercițiul 4b. Raportul jurnalului: GET /api/jurnal/raport?metoda=GET
import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

// montat cu app.use('/api/jurnal', ...), deci '/raport' răspunde la /api/jurnal/raport
router.get('/raport', async (req, res) => {
  const metoda = req.query.metoda ?? ''

  let sql = `SELECT metoda, cale, COUNT(*) AS cereri, ROUND(AVG(durata_ms), 1) AS medie_ms
               FROM jurnal`
  const valori = []

  // Exercițiul 4c, după corectare: valoarea pleacă separat, în locul semnului ?
  if (metoda !== '') {
    sql += ' WHERE metoda = ?'
    valori.push(metoda)
  }

  sql += ' GROUP BY metoda, cale ORDER BY cereri DESC LIMIT 10'

  const [randuri] = await pool.query(sql, valori)

  // AVG sosește ca șir (figura 5), deci se convertește la număr înainte de trimitere
  res.json(
    randuri.map((r) => ({ ...r, cereri: Number(r.cereri), medie_ms: Number(r.medie_ms) })),
  )
})

export default router
