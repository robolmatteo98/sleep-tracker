import { DateTime } from "luxon";
import { useEffect, useState } from "react";

import "./Insights.css";

type InsightsProps = {
  day: Date | null;
  startDate: string | null;
}

const Insights = ({ day, startDate } : InsightsProps) => {
  const [firstAdvise, setFirstAdvise] = useState<boolean>(false);  

  useEffect(() => {
    if (day && startDate) {
      console.log(day)
      console.log(startDate)
      const baseDate = DateTime.fromFormat(startDate, 'dd/MM/yyyy HH:mm');
      const dayDate = DateTime.fromJSDate(day).set({
        hour: 23,
        minute: 0,
        second: 0,
        millisecond: 0
      });

      if (dayDate.hasSame(baseDate, 'day')) {
        setFirstAdvise(true);
      } else {
        if (dayDate.minus({ day: 1 }).toMillis() < baseDate.toMillis()) {
          setFirstAdvise(true);
        } else {
          setFirstAdvise(false);
          console.log(baseDate.toISODate());
        }
      }
    }
  }, [day, startDate]);

  // Render
  return (
    <>
      <p className="text-center text-bold">Insights e consigli</p>
      {firstAdvise ? <div className="data-card-insights text-center">
        <p>
          Scegli un orario regolare per andare a dormire.
          L'orario ideale è tra le 22:00 e le 23:00.
        </p>
      </div> : null}
      <div className="data-card-insights text-center">
        <p>
          Evita stimoli prima di dormire. Evita di utilizzare telefoni, tablet e pc 1 ora prima di andare a dormire.
        </p>
      </div>
      <div className="data-card-insights text-center">
        <p>
          Evita caffeina e bevande energetiche.
        </p>
      </div>
      <div className="data-card-insights text-center">
        <p>
          Leggi un libro, fai meditazione, stretching leggero o ascolta musica tranquilla.
        </p>
      </div>
    </>
  )

}

export default Insights;