import DestinatieCard from './DestinatieCard.jsx'

// Transformă lista de date într-o listă de carduri, cu map.
// Funcțiile onToggle și onDelete doar trec pe aici, mai departe la fiecare card.
export default function ListaDestinatii({ destinatii, onToggle, onDelete }) {
  if (destinatii.length === 0) {
    return <p className="info">Nu există nicio destinație.</p>
  }

  return (
    <div className="lista">
      {destinatii.map((destinatie) => (
        <DestinatieCard
          key={destinatie.id} // identificatorul, nu poziția din listă
          destinatie={destinatie}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
