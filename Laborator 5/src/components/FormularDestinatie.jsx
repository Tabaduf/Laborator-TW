import { useState } from 'react'

const GOL = { oras: '', tara: '', zile: '' }

// Ex. 2b: întoarce un obiect cu un mesaj pentru fiecare câmp greșit.
// Un câmp corect nu apare în obiect, deci obiect gol = date corecte.
function valideaza(valori) {
  const erori = {}
  const zile = Number(valori.zile)

  if (valori.oras.trim().length < 2) {
    erori.oras = 'Orașul are cel puțin două caractere.'
  }
  if (valori.tara.trim() === '') {
    erori.tara = 'Țara este obligatorie.'
  }
  if (valori.zile === '' || Number.isNaN(zile) || zile < 1 || zile > 30) {
    erori.zile = 'Numărul de zile este între 1 și 30.'
  }

  return erori
}

export default function FormularDestinatie({ onAdd, seTrimite }) {
  // Ex. 2a: cele trei câmpuri într-un singur obiect
  const [valori, setValori] = useState(GOL)
  const [erori, setErori] = useState({})

  // un singur onChange pentru toate câmpurile, după atributul name
  function handleChange(event) {
    const { name, value } = event.target
    setValori((curent) => ({ ...curent, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    // Ex. 2c: rezultatul validării intră în starea erori
    const gasite = valideaza(valori)
    setErori(gasite)
    if (Object.keys(gasite).length > 0) {
      return
    }

    // fără id: îl generează serverul
    const salvat = await onAdd({
      oras: valori.oras.trim(),
      tara: valori.tara.trim(),
      zile: Number(valori.zile),
      vizitat: false,
    })

    // câmpurile se golesc doar dacă serverul a salvat destinația
    if (salvat) {
      setValori(GOL)
    }
  }

  return (
    <form className="formular" onSubmit={handleSubmit} noValidate>
      <div className="camp">
        <input
          name="oras"
          placeholder="Oraș"
          value={valori.oras}
          onChange={handleChange}
          className={erori.oras ? 'invalid' : ''}
        />
        {erori.oras && <p className="eroare-camp">{erori.oras}</p>}
      </div>

      <div className="camp">
        <input
          name="tara"
          placeholder="Țară"
          value={valori.tara}
          onChange={handleChange}
          className={erori.tara ? 'invalid' : ''}
        />
        {erori.tara && <p className="eroare-camp">{erori.tara}</p>}
      </div>

      <div className="camp">
        <input
          name="zile"
          type="number"
          placeholder="Zile"
          value={valori.zile}
          onChange={handleChange}
          className={erori.zile ? 'invalid' : ''}
        />
        {erori.zile && <p className="eroare-camp">{erori.zile}</p>}
      </div>

      <button type="submit" disabled={seTrimite}>
        {seTrimite ? 'Se trimite...' : 'Adaugă'}
      </button>
    </form>
  )
}
