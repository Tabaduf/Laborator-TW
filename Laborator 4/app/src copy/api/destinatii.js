// Toate cererile către serverul de test stau aici, nu în componente.
// Exercițiul 5: pentru setul de 2000 de destinații se schimbă temporar în 3002.
const API_URL = 'http://localhost:3001'

// Ex. 1a + 5c: GET o pagină de destinații.
// Întoarce obiectul primit: { first, prev, next, last, pages, items, data }
export async function getDestinatii(pagina = 1) {
  const response = await fetch(`${API_URL}/destinatii?_page=${pagina}&_per_page=20`)

  if (!response.ok) {
    throw new Error(`Serverul a răspuns cu ${response.status}`)
  }

  return response.json()
}

// Ex. 1a: POST o destinație nouă; serverul întoarce obiectul salvat, cu id-ul lui
export async function postDestinatie(destinatie) {
  const response = await fetch(`${API_URL}/destinatii`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(destinatie),
  })

  if (!response.ok) {
    throw new Error(`Serverul a răspuns cu ${response.status}`)
  }

  return response.json()
}

// Ex. 1a: PATCH schimbă doar câmpul vizitat și întoarce obiectul actualizat
export async function patchVizitat(id, vizitat) {
  const response = await fetch(`${API_URL}/destinatii/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vizitat }),
  })

  if (!response.ok) {
    throw new Error(`Serverul a răspuns cu ${response.status}`)
  }

  return response.json()
}
