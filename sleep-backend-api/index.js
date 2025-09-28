require('dotenv').config(); // carica le variabili d'ambiente

const express = require("express");
const app = express();
const cors = require('cors');
const multer = require("multer");
const fs = require("fs");
const csv = require('csv-parser');
const { DateTime } = require('luxon');

const PORT = process.env.PORT || 5001; // usa la variabile, oppure un fallback

const pool = require('./config/db');

// bcrypt
const bcrypt = require("bcrypt");

// Abilita CORS per tutte le richieste
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  return res.json('GET METHOD FROM THE APP.');
});

app.get('/auth', async (req, res) => {
  let response = {
    userId: null,
    message: "OK",
    code : 200
  }

  const { username, plainPassword } = req.query;

  const result = await pool.query("SELECT id, password_enc FROM Users WHERE username = $1", [username]);
  if (result.rowCount > 0) {
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(plainPassword, user.password_enc);
    console.log(result)
    console.log(isMatch)

    if (isMatch) {
      response.userId = user.id
    } else {
      response.status = "Errore: password errata"
      response.code = 500
    }
  } else {
    response.status = "Utente non trovato"
    response.code = 500
  }

  return res.json(response).status(response.code);
});

app.post('/signup', async (req, res) => {
  try {
    const { username, plainPassword } = req.body;

    // genera l'hash della password
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    await pool.query("INSERT INTO Users(username, password_enc) VALUES($1, $2)", [username, hashedPassword]);
    return res.json({ status: "Utente creato correttamente" }).status(200);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "Errore nel signup" });
  }
});

app.get('/sleep_data_format', async (req, res) => {
  const { id, date } = req.query;

  const object_id_day = await pool.query("SELECT id FROM sleep_day WHERE fk_users = $1 AND day = $2", [id, date]);

  if(object_id_day.rowCount > 0) {
    const results = await pool.query("SELECT * FROM sleep_data_format WHERE fk_sleep_day = $1 order by timestamp", [object_id_day.rows[0]['id']]);

    const min = await pool.query("SELECT MIN(timestamp) FROM sleep_data_format WHERE fk_sleep_day = $1", [object_id_day.rows[0]['id']]);
    const max = await pool.query("SELECT MAX(timestamp) FROM sleep_data_format WHERE fk_sleep_day = $1", [object_id_day.rows[0]['id']]);

    return res.json({ data: results.rows, min: min.rows[0]['min'], max: max.rows[0]['max'] });
  } else {
    return res.json({ data: [] });
  }
});

const upload = multer({ dest: "uploads/" }); // salva il file nella cartella uploads/

app.post("/upload-csv", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Nessun file caricato" });
    }

    const results = [];
    const user_ID = req.body.userId;
    const sleep_day = req.body.sleep_date;

    const result = await pool.query(`INSERT INTO sleep_day(day, fk_users) VALUES($1, $2) RETURNING id`, [sleep_day, user_ID]);
    const insertedId = result.rows[0].id;
    console.log(insertedId)

    // 1. Leggo il CSV
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        console.log("CSV parsato:", results);

        // 2. Inserisco i dati nella tabella sleep_data_format
        // (adatta i campi in base alle tue colonne reali)
        try {
          for (const row of results) {
            await pool.query(
              `INSERT INTO sleep_data_format (timestamp, sleep_stage, fk_sleep_day)
               VALUES ($1, $2, $3)`,
              [
                row['Timestamp'],
                row['Sleep Stage'],
                insertedId
              ]
            );
          }

          res.json({ message: "CSV caricato e salvato nel DB!" });
        } catch (dbErr) {
          console.error("Errore DB:", dbErr);
          res.status(500).json({ message: "Errore durante l'inserimento nel DB" });
        } finally {
          // 3. Pulizia: rimuovo il file temporaneo
          fs.unlinkSync(req.file.path);
        }
      });
  } catch (err) {
    console.error("Errore server:", err);
    res.status(500).json({ message: "Errore interno" });
  }
});

app.post('/insert-data', async (req, res) => {
  const { userId, day, dalle, alle, stage } = req.body;

  try {
    // recupero sleep_day.id
    const results = await pool.query(
      `SELECT id FROM sleep_day WHERE fk_users = $1 AND day = $2`,
      [userId, day]
    );

    if (results.rows.length === 0) {
      return res.status(404).json({ error: "sleep_day non trovato" });
    }

    const sleepDayId = results.rows[0].id;

    // parsing date (es. "2025-09-26T23:00")
    const da = DateTime.fromISO(dalle);
    const a = DateTime.fromISO(alle);

    if (!da.isValid || !a.isValid) {
      return res.status(400).json({ error: "Formato date non valido" });
    }

    // genera array di minuti
    let current = da;
    const values = [];

    while (current <= a) {
      values.push([sleepDayId, current.toISO(), stage]);
      current = current.plus({ minutes: 1 });
    }

    // insert multiplo
    const query = `
      INSERT INTO sleep_data_format (fk_sleep_day, timestamp, sleep_stage)
      VALUES ${values.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(",")}
    `;

    const flatValues = values.flat();

    await pool.query(query, flatValues);

    res.json({ message: "Dati inseriti con successo", count: values.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nel server" });
  }
});

/*app.get('/total_sleep_last_day', async (req, res) => {
  const results = await pool.query("SELECT * FROM sleep_data_format");
  console.log(results.rows);

  let totalMinutes = results.rowCount;
  let hours = 0;
  while(totalMinutes - 60 > 0) {
    totalMinutes -= 60;
    hours += 1;
  }
  return res.json({ hours, totalMinutes })
})*/

app.get('/total_sleep_last_week', async (req, res) => {
  const results = [
    { id: 1, quality: 80, totalSleep: 480 },
    { id: 2, quality: 56, totalSleep: 300 },
    { id: 3, quality: 92, totalSleep: 471 },
    { id: 4, quality: 91, totalSleep: 469 },
    { id: 5, quality: 87, totalSleep: 403 },
    { id: 6, quality: 89, totalSleep: 495 },
    { id: 7, quality: 91, totalSleep: 501 },
  ]

  return res.json({ data: results });
})

app.get('/total_sleep_last_month', async (req, res) => {
  const results = [
    { id: 1, quality: 80, totalSleep: 480 },
    { id: 2, quality: 56, totalSleep: 300 },
    { id: 3, quality: 92, totalSleep: 471 },
    { id: 4, quality: 91, totalSleep: 469 },
    { id: 5, quality: 87, totalSleep: 403 },
    { id: 6, quality: 89, totalSleep: 495 },
    { id: 7, quality: 91, totalSleep: 501 },
    { id: 8, quality: 94, totalSleep: 461 },
    { id: 9, quality: 92, totalSleep: 434 },
    { id: 10, quality: 90, totalSleep: 440 },
    { id: 11, quality: 89, totalSleep: 447 },
    { id: 12, quality: 86, totalSleep: 480 },
    { id: 13, quality: 64, totalSleep: 440 },
    { id: 14, quality: 86, totalSleep: 419 },
    { id: 15, quality: 87, totalSleep: 446 },
    { id: 16, quality: 89, totalSleep: 444 },
    { id: 17, quality: 91, totalSleep: 411 },
    { id: 18, quality: 94, totalSleep: 403 },
    { id: 19, quality: 94, totalSleep: 446 },
    { id: 20, quality: 30, totalSleep: 247 },
    { id: 21, quality: 78, totalSleep: 514 },
    { id: 22, quality: 72, totalSleep: 381 },
    { id: 23, quality: 75, totalSleep: 433 },
    { id: 24, quality: 83, totalSleep: 499 },
    { id: 25, quality: 90, totalSleep: 435 },
    { id: 26, quality: 92, totalSleep: 493 },
    { id: 27, quality: 85, totalSleep: 402 },
    { id: 28, quality: 80, totalSleep: 408 },
    { id: 29, quality: 86, totalSleep: 444 },
    { id: 30, quality: 72, totalSleep: 430 },
    { id: 31, quality: 89, totalSleep: 426 },
  ]

  return res.json({ data: results });
})

/*app.get('/start_end_sleep', async (req, res) => {
  const results = await pool.query("SELECT * FROM sleep_data_format");
  console.log(results.rows);
  return res.json({ data: results.rows })
});*/

app.listen(PORT, () => {
  console.log(`Sleep API listening on port ${PORT}`)
});