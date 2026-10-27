import { useState } from 'react'

// Formular „controlat”: fiecare câmp își ține valoarea în stare,
// iar ce se vede în câmp vine din stare (value={...}).
export default function FormularDestinatie({ onAdd }) {
  const [oras, setOras] = useState('')
  const [tara, setTara] = useState('')
  const [zile, setZile] = useState('')

  function handleSubmit(event) {
    event.preventDefault() // altfel browserul reîncarcă pagina și starea se pierde

    // fără oraș sau țară nu se adaugă nimic
    if (oras.trim() === '' || tara.trim() === '') return

    onAdd({
      id: crypto.randomUUID(),
      oras: oras.trim(),
      tara: tara.trim(),
      zile: Number(zile), // câmpurile întorc text: '3' devine 3
      vizitat: false,
    })

    // golim câmpurile pentru următoarea adăugare
    setOras('')
    setTara('')
    setZile('')
  }

  return (
    <form className="formular" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Oraș"
        value={oras}
        onChange={(e) => setOras(e.target.value)}
      />
      <input
        type="text"
        placeholder="Țară"
        value={tara}
        onChange={(e) => setTara(e.target.value)}
      />
      <input
        type="number"
        min="0"
        placeholder="Zile"
        value={zile}
        onChange={(e) => setZile(e.target.value)}
      />
      <button type="submit">Adaugă</button>
    </form>
  )
}
