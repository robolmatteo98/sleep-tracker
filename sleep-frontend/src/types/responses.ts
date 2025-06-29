export type SleepDataResponse = {
  data: {
    id: number;
    _timestamp: string;
    _sleep_stage: string;
  } []
};

export type SleepWeekDataResponse = {
  data: {
    id: number;
    quality: number;
    totalSleep: number;
  } []
};

export type SleepMonthDataResponse = {
  data: {
    id: number;
    quality: number;
    totalSleep: number;
  } []
};