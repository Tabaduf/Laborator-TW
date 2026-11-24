# Laboratorul 5 — City Explorer cu Express și MariaDB

Caciularu Stefan Arthur, grupa 633AB

## Cum se pornește (manual)

Trei programe, în trei terminale, fiecare lăsat deschis:

```
cd server
docker compose up -d      # baza de date MariaDB, în container (o singură dată)
npm install               # prima dată
npm run dev               # serverul Express, pe http://localhost:3000
```

```
npm install               # în rădăcina proiectului, prima dată
npm run dev               # interfața React, pe http://localhost:5173
```


## Ce face fiecare fișier din `server`

| Fișier | Ce face, pe scurt |
|---|---|
| `docker-compose.yml` | descrie containerul MariaDB: imaginea `mariadb:11`, baza `city_explorer`, utilizatorul `web`/`web`, portul 3306 |
| `schema.sql` | creează tabelele `orase`, `destinatii`, `jurnal` și pune cele 6 destinații |
| `.env` | parola și adresa bazei; nu se scriu în cod și nu se urcă pe GitHub |
| `package.json` | `"type": "module"` (ca să meargă `import`) și comanda `npm run dev` |
| `db.js` | pool-ul de conexiuni `mysql2/promise`: conexiuni deschise o dată și refolosite |
| `index.js` | serverul: middleware-urile și rutele |
| `jurnal.js` | middleware-ul care scrie fiecare cerere în tabela `jurnal` |
| `rute/statistici.js` | ruta panoului de statistici (din arhivă) |
| `rute/jurnal.js` | raportul `GET /api/jurnal/raport` |
| `tipuri.js`, `genereaza.js` | scripturile auxiliare din anexa A |

## Rutele

| Metodă și cale | Ce face | Coduri |
|---|---|---|
| `GET /api/destinatii` | toate destinațiile, ordonate după id | 200 |
| `GET /api/destinatii/caut?oras=X` | destinațiile cu orașul exact X | 200 |
| `POST /api/destinatii` | validează și adaugă | 201 sau 400 |
| `PATCH /api/destinatii/:id` | schimbă doar `vizitat` | 200, 404 sau 400 |
| `ALL /api/ecou/:id` | întoarce params, query, body (temporară) | 200 |
| `GET /api/statistici?prag=3&tara=X` | COUNT și SUM, calculate în SQL | 200 sau 400 |
| `GET /api/jurnal/raport?metoda=GET` | cele mai cerute adrese, cu durata medie | 200 |

## Întrebări probabile și răspunsuri scurte

**Ce e un middleware?** O funcție `(req, res, next)` prin care trece fiecare cerere înainte de rută. Dacă nu apelează `next()`, cererea se oprește acolo.

**De ce `express.json()` înaintea rutelor?** El citește corpul cererii și îl pune în `req.body`. Pus după rute, ajunge prea târziu și `req.body` rămâne `undefined`, iar ruta dă 500.

**De ce `cors()`?** Pagina (portul 5173) și API-ul (3000) sunt origini diferite. Browserul dă răspunsul paginii doar dacă serverul trimite antetul `Access-Control-Allow-Origin`. `curl` nu e browser, deci pe el regula nu îl afectează.

**Ce e cererea OPTIONS?** Verificarea prealabilă (preflight): înainte de un PATCH/POST cu JSON, browserul întreabă serverul dacă are voie. `cors()` răspunde singur cu 204.

**De ce jurnalul stă înaintea lui `cors()`?** `cors()` răspunde la OPTIONS fără să apeleze `next()`, deci un jurnal pus după el nu vede cererile OPTIONS.

**De ce `?` în interogări?** Valoarea trimisă de utilizator pleacă separat de textul comenzii, deci nu poate schimba comanda (SQL injection). Lipită în text, `GET' OR '1'='1` face filtrul mereu adevărat, iar `O'Brien` strică sintaxa.

**De ce `String(id)` și `Boolean(vizitat)`?** MariaDB dă id-ul ca număr și BOOLEAN ca 0/1 (e de fapt TINYINT). Interfața din lucrările trecute așteaptă șir și true/false.

**De ce `Number(...)` la `req.query`?** Tot ce vine din adresă este text: `"400"`, nu `400`.

**De ce `return` înainte de `res.status(400)`?** Fără el funcția continuă, rulează interogarea și încearcă să răspundă a doua oară: `Cannot set headers after they are sent`.

**De ce `affectedRows`?** Dacă e 0, nu există destinația, deci răspunsul corect e 404, nu 200.

**De ce `res.on('finish')` în jurnal?** Codul de stare și durata se cunosc abia după ce răspunsul a plecat. Iar `try/catch` acolo, pentru că o eroare din `finish` nu mai poate deveni răspuns și ar opri serverul.

**Ce arată EXPLAIN?** Cum va citi baza rândurile: `type ALL` = tot tabelul, rând cu rând; `type ref` cu `key idx_oras` = caută în index; `rows` = câte rânduri estimează că citește.

**De ce indexul nu ajută `/api/destinatii`?** Acolo problema nu e căutarea, ci cantitatea: se trimit toate rândurile (megaocteți). Se rezolvă cu paginare pe server (`LIMIT` și `OFFSET`).
