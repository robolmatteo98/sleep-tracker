require('dotenv').config(); // carica le variabili d'ambiente

const express = require("express");
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 5001; // usa la variabile, oppure un fallback

const pool = require('./config/db');

// Abilita CORS per tutte le richieste
app.use(cors());

app.get('/', (req, res) => {
  return res.json('GET METHOD FROM THE APP.');
});

app.get('/sleep_data_format', async (req, res) => {
  const results = await pool.query("SELECT * FROM sleep_data_format");
  console.log(results.rowCount);
  return res.json({ data: results.rows })
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