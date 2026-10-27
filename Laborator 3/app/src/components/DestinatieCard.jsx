// O singură destinație. Cardul nu schimbă lista (lista nu îi aparține),
// ci doar ANUNȚĂ părintele, apelând funcțiile primite prin props.
export default function DestinatieCard({ destinatie, onToggle, onDelete }) {
  const { id, oras, tara, zile, vizitat } = destinatie

  return (
    // clasa „vizitat” se adaugă doar când destinația e vizitată
    <article className={vizitat ? 'card vizitat' : 'card'}>
      <h3>{oras}</h3>
      <p className="tara">{tara}</p>
      <p className="zile">{zile} zile</p>

      {/* funcție săgeată: onToggle se apelează abia la click, nu la desenare */}
      <button type="button" onClick={() => onToggle(id)}>
        {vizitat ? 'Vizitat' : 'Marchează vizitat'}
      </button>

      {/* cerința suplimentară: butonul de ștergere */}
      <button type="button" className="sterge" onClick={() => onDelete(id)}>
        Șterge
      </button>
    </article>
  )
}
