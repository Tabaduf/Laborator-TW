// Funcții "pure": nu modifică lista primită, întorc mereu o listă NOUĂ.
// De asta React observă schimbarea când le folosim cu setDestinatii.

export const getNevizitate = (list) => list.filter((d) => !d.vizitat)

export const totalZile = (list) => list.reduce((total, d) => total + d.zile, 0)

export const marcheazaVizitat = (list, id) =>
  list.map((d) => (d.id === id ? { ...d, vizitat: !d.vizitat } : d))

export const adaugaDestinatie = (list, destinatie) => [...list, destinatie]

// Cerința suplimentară: păstrează toate destinațiile, mai puțin cea cu id-ul dat
export const stergeDestinatie = (list, id) => list.filter((d) => d.id !== id)
