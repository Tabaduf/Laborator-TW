import { useEffect, useState } from 'react'

// Varianta corectată. Cele cinci corecturi de cod sunt marcate cu „Corectura”.
export default function PanouStatistici() {
  const [destinatii, setDestinatii] = useState([])
  const [incarcare, setIncarcare] = useState(true)
  const [eroare, setEroare] = useState(null)
  const [prag, setPrag] = useState('3')

  useEffect(() => {
    async function incarca() {
      try {
        const response = await fetch('http://localhost:3001/destinatii')

        if (!response.ok) {
          throw new Error(`Serverul a răspuns cu ${response.status}`)
        }

        const date = await response.json()
        setDestinatii(date)
      } catch (err) {
        setEroare(err.message)
      } finally {
        setIncarcare(false) // Corectura 5: în finally, nu doar în try
      }
    }

    incarca()
  }, [])

  if (incarcare) {
    return <p className="stare">Se încarcă statisticile...</p>
  }

  if (eroare) {
    return <p className="stare eroare">Statistici indisponibile: {eroare}</p>
  }

  // Corectura 3: „cel puțin” înseamnă >=, nu >
  const filtrate = destinatii.filter((d) => d.zile >= Number(prag))
  // Corectura 1: totalul se calculează pe filtrate, nu pe toate destinațiile
  const totalZile = filtrate.reduce((suma, d) => suma + d.zile, 0)
  const medie = filtrate.length === 0 ? 0 : totalZile / filtrate.length

  return (
    <section className="panou">
      <h2>Statistici</h2>

      <label>
        Cel puțin{' '}
        <input
          type="number"
          value={prag}
          onChange={(event) => setPrag(event.target.value)} // Corectura 4: valoarea, nu evenimentul
        />{' '}
        zile
      </label>

      {/* Corectura 2: condiție booleană, === 0 */}
      {filtrate.length === 0 && (
        <p className="gol">Nicio destinație cu cel puțin {prag} zile.</p>
      )}

      {filtrate.length > 0 && (
        <ul>
          <li>Destinații: {filtrate.length}</li>
          <li>Total zile: {totalZile}</li>
          <li>Media: {medie.toFixed(1)} zile</li>
        </ul>
      )}
    </section>
  )
}
