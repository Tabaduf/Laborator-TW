import { useState } from 'react'
import { destinatii as destinatiiInitiale } from './data/destinatii.js'
import {
  getNevizitate,
  totalZile,
  marcheazaVizitat,
  adaugaDestinatie,
  stergeDestinatie,
} from './utils/destinatii.js'
import Rezumat from './components/Rezumat.jsx'
import FormularDestinatie from './components/FormularDestinatie.jsx'
import ListaDestinatii from './components/ListaDestinatii.jsx'
import './App.css'

export default function App() {
  // Singura stare a aplicației: lista de destinații.
  const [destinatii, setDestinatii] = useState(destinatiiInitiale)

  // Calculate din stare la fiecare desenare, deci rezumatul e mereu la zi.
  const nevizitate = getNevizitate(destinatii)

  // Forma cu funcție: React ne dă valoarea curentă, noi întoarcem o listă nouă.
  function handleToggle(id) {
    setDestinatii((curent) => marcheazaVizitat(curent, id))
  }

  function handleAdd(destinatie) {
    setDestinatii((curent) => adaugaDestinatie(curent, destinatie))
  }

  // Cerința suplimentară
  function handleDelete(id) {
    setDestinatii((curent) => stergeDestinatie(curent, id))
  }

  return (
    <main>
      <h1>City Explorer</h1>
      <Rezumat
        total={destinatii.length}
        nevizitate={nevizitate.length}
        zile={totalZile(nevizitate)}
      />
      <FormularDestinatie onAdd={handleAdd} />
      <ListaDestinatii
        destinatii={destinatii}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </main>
  )
}
