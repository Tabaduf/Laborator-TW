import { useEffect, useState } from 'react'
import { getStatistici } from '../api/statistici.js'

// Panoul de statistici: cifrele sunt calculate de server, în SQL (COUNT, SUM).
// La fiecare tastare în câmpuri pleacă o cerere nouă către /api/statistici.
export default function PanouStatistici() {
  const [prag, setPrag] = useState('3')
  const [tara, setTara] = useState('')
  const [date, setDate] = useState(null)
  const [eroare, setEroare] = useState(null)

  useEffect(() => {
    async function incarca() {
      try {
        const rezultat = await getStatistici(prag, tara.trim())
        setDate(rezultat)
        setEroare(null)
      } catch (err) {
        setEroare(err.message)
      }
    }

    incarca()
  }, [prag, tara])

  return (
    <section className="panou">
      <h2>Statistici</h2>

      <label>
        Cel puțin{' '}
        <input type="number" value={prag} onChange={(event) => setPrag(event.target.value)} />{' '}
        zile
      </label>{' '}
      <label>
        Țara{' '}
        <input
          className="panou-tara"
          type="text"
          placeholder="toate"
          value={tara}
          onChange={(event) => setTara(event.target.value)}
        />
      </label>

      {eroare && <p className="stare eroare">Statistici indisponibile: {eroare}</p>}

      {!eroare && date && (
        <ul>
          <li>Destinații: {date.destinatii}</li>
          <li>Total zile: {date.zile}</li>
          <li>Media: {date.medie} zile</li>
        </ul>
      )}
    </section>
  )
}
