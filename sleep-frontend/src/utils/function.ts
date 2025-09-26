import { DateTime } from "luxon";
import { SleepData, PercentageType } from "../types/entities";

export const timeOfStage = (data: SleepData[], stage: string) => {
  let sum = 0;
  data.forEach(el => {
    if(el._sleep_stage === stage) {
      sum += 1;
    }
  })
  return sum;
};

export const formatMinutes = (minutes: number) => {
  let totalHours = 0;
  while(minutes - 60 > 0) {
    totalHours += 1;
    minutes -= 60;
  }

  return totalHours.toString() + "h " + minutes.toString() + "m";
};

export const getPercentageValues = (stages: string[], sleepData: SleepData[]) => {
  const percentage_values: PercentageType[] = stages.map(stage => ({
    stage: stage,
    perc: (timeOfStage(sleepData, stage) * 100) / sleepData.length
  }));

  return percentage_values;
}

export const preparePieData = (data: SleepData[]) => {
  const sleepStages: Record<string, number> = {};

  data.forEach((item, index) => {
    if (index < data.length - 1) {
      const start = DateTime.fromFormat(item._timestamp, "dd/MM/yyyy HH:mm");
      const end = DateTime.fromFormat(data[index + 1]._timestamp, "dd/MM/yyyy HH:mm");

      const duration = (end.toMillis() - start.toMillis()) / 60000; // minuti
      sleepStages[item._sleep_stage] = (sleepStages[item._sleep_stage] || 0) + duration;
    }
  });

  return Object.keys(sleepStages).map((stage) => ({
    name: stage + ": " + formatMinutes(sleepStages[stage]),
    value: sleepStages[stage]
  }));
};