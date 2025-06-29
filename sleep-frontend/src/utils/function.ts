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