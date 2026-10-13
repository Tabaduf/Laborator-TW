const API_URL = 'https://jsonplaceholder.typicode.com'

// Apelează /users pentru toți utilizatorii
export async function fetchUsers() {
  const response = await fetch(`${API_URL}/users`)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.json()
}

// Apelează /users/:id pentru un singur utilizator
export async function fetchUserById(id) {
  const response = await fetch(`${API_URL}/users/${id}`)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.json()
}