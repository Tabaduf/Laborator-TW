import { useEffect, useState } from 'react'
import { getNevizitate, totalZile } from './utils/destinatii.js'
import { getDestinatii, postDestinatie, patchVizitat } from './api/destinatii.js'
import ListaDestinatii from './components/ListaDestinatii.jsx'
import FormularDestinatie from './components/FormularDestinatie.jsx'
import Rezumat from './components/Rezumat.jsx'
import Cautare from './components/Cautare.jsx'
import './App.css'

export default function App() {
  // Ex. 1b: cele trei stări ale cererii
  const [destinatii, setDestinatii] = useState([])
  const [incarcare, setIncarcare] = useState(true)
  const [eroare, setEroare] = useState(null)

  const [seTrimite, setSeTrimite] = useState(false)     // ex. 2, butonul dezactivat
  const [eroareSalvare, setEroareSalvare] = useState(null)
  const [cautare, setCautare] = useState('')            // ex. 3a
  const [pagina, setPagina] = useState(1)               // ex. 5c
  const [totalPagini, setTotalPagini] = useState(1)

  // Ex. 1b + 5c: se încarcă la pornire și la fiecare schimbare de pagină
  useEffect(() => {
    async function incarca() {
      try {
        const rezultat = await getDestinatii(pagina)
        setDestinatii(rezultat.data)
        setTotalPagini(rezultat.pages)
        setEroare(null)
      } catch (error) {
        setEroare(error.message)
      } finally {
        setIncarcare(false)
      }
    }

    incarca()
  }, [pagina])

  // Ex. 1c: întâi serverul, apoi starea, cu obiectul întors de server
  async function handleToggle(id) {
    const destinatie = destinatii.find((d) => d.id === id)
    try {
      const salvata = await patchVizitat(id, !destinatie.vizitat)
      setDestinatii((curent) => curent.map((d) => (d.id === id ? salvata : d)))
      setEroareSalvare(null)
    } catch (error) {
      setEroareSalvare(error.message)
    }
  }

  // Ex. 2: POST, apoi în stare intră obiectul întors (cu id), nu cel trimis
  async function handleAdd(destinatie) {
    setSeTrimite(true)
    try {
      const salvata = await postDestinatie(destinatie)
      setDestinatii((curent) => [...curent, salvata])
      setEroareSalvare(null)
      return true
    } catch (error) {
      setEroareSalvare(error.message)
      return false
    } finally {
      setSeTrimite(false)
    }
  }

  // Rezumatul descrie aplicația, deci se calculează din starea completă
  const nevizitate = getNevizitate(destinatii)

  // Ex. 3b: se filtrează doar lista afișată, fără cerere nouă
  const text = cautare.trim().toLowerCase()
  const afisate = destinatii.filter(
    (d) => d.oras.toLowerCase().includes(text) || d.tara.toLowerCase().includes(text),
  )

  // Ex. 1b: încărcare, eroare, abia apoi aplicația
  if (incarcare) {
    return (
      <main>
        <h1>City Explorer</h1>
        <p className="stare">Se încarcă destinațiile...</p>
      </main>
    )
  }

  if (eroare) {
    return (
      <main>
        <h1>City Explorer</h1>
        <p className="stare eroare">Nu am putut încărca datele: {eroare}</p>
      </main>
    )
  }

  return (
    <main>
      <h1>City Explorer</h1>
      <Rezumat
        total={destinatii.length}
        nevizitate={nevizitate.length}
        zile={totalZile(nevizitate)}
      />
      <FormularDestinatie onAdd={handleAdd} seTrimite={seTrimite} />
      {eroareSalvare && (
        <p className="stare eroare">Modificarea nu a ajuns pe server: {eroareSalvare}</p>
      )}
      <Cautare valoare={cautare} onChange={setCautare} />

      {/* Ex. 3c: două motive diferite pentru o listă goală */}
      {destinatii.length === 0 ? (
        <p className="gol">Nu există nicio destinație. Adaugă prima din formular.</p>
      ) : afisate.length === 0 ? (
        <p className="gol">Niciun rezultat pentru „{cautare.trim()}”.</p>
      ) : (
        <ListaDestinatii destinatii={afisate} onToggle={handleToggle} />
      )}

      {/* Ex. 5c: paginarea; cu o singură pagină nu are rost să apară */}
      {totalPagini > 1 && (
        <div className="paginare">
          <button type="button" disabled={pagina === 1} onClick={() => setPagina((p) => p - 1)}>
            Înapoi
          </button>
          <span>pagina {pagina} din {totalPagini}</span>
          <button
            type="button"
            disabled={pagina === totalPagini}
            onClick={() => setPagina((p) => p + 1)}
          >
            Înainte
          </button>
        </div>
      )}
    </main>
  )
}
