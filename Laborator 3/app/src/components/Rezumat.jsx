// Primește trei numere prin props și doar le afișează.
// Nu ține nicio stare: numerele sunt calculate în App, din lista din stare.
export default function Rezumat({ total, nevizitate, zile }) {
  return (
    <p className="rezumat">
      {total} destinații, {nevizitate} nevizitate, {zile} zile de vizitat
    </p>
  )
}
