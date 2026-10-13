

// 1. Extrage lista cu numele orașelor folosind .map()
export const getOrase = (list) => list.map((d) => d.oras)

// 2. Filtrează doar destinațiile nevizitate (vizitat === false)
export const getNevizitate = (list) => list.filter((d) => !d.vizitat)

// 3. Calculează suma totală a zilelor folosind .reduce() cu valoare inițială 0
export const totalZile = (list) => list.reduce((total, d) => total + d.zile, 0)

// 4. Formatează o destinație într-un șir de caractere:
// Exemplu: [x] Cluj-Napoca, România (2 zile) sau [ ] Lisabona, Portugalia (4 zile)
export const formatDestinatie = ({ oras, tara, zile, vizitat }) =>
  `${vizitat ? '[x]' : '[ ]'} ${oras}, ${tara} (${zile} zile)`

// 5. Grupează și numără destinațiile pe țări folosind .reduce() și cheie calculată
export const numarPeTara = (list) =>
  list.reduce(
    (acc, { tara }) => ({
      ...acc,
      [tara]: (acc[tara] ?? 0) + 1
    }),
    {}
  )

// 6. Sortează descrescător după numărul de zile.
// .sort() modifică array-ul pe loc, deci sortăm o copie creată cu spread [...list]
export const sortDupaZile = (list) => [...list].sort((a, b) => b.zile - a.zile)




// Exercitiul 2

// Invertează valoarea proprietății 'vizitat' pentru elementul cu id-ul dat
export const marcheazaVizitat = (list, id) =>
  list.map((d) => (d.id === id ? { ...d, vizitat: !d.vizitat } : d))

// Returnează o listă nouă ce conține toate elementele anterioare plus noua destinație
export const adaugaDestinatie = (list, d) => [...list, d]

// Returnează o listă nouă excluzând elementul cu id-ul specificat
export const stergeDestinatie = (list, id) => list.filter((d) => d.id !== id)