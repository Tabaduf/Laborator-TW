// Exercițiul 4a. Middleware-ul care scrie fiecare cerere terminată în tabela jurnal.
import { pool } from './db.js'

export function jurnal(req, res, next) {
  const inceput = process.hrtime.bigint()
  // calea se reține aici, înainte de next(): mai târziu, în interiorul unui
  // router, req.path ar fi doar „/”
  const cale = req.originalUrl

  // codul de stare și durata se știu abia după ce răspunsul a plecat
  res.on('finish', async () => {
    const durata = Number(process.hrtime.bigint() - inceput) / 1e6

    // try/catch: aici o eroare nu mai poate deveni răspuns (a plecat deja),
    // iar fără el ar opri tot procesul serverului
    try {
      await pool.query(
        'INSERT INTO jurnal (metoda, cale, status, durata_ms) VALUES (?, ?, ?, ?)',
        [req.method, cale.slice(0, 255), res.statusCode, Math.round(durata)],
      )
    } catch (eroare) {
      console.error('Jurnal: rândul nu a putut fi scris:', eroare.message)
    }
  })

  next()
}
