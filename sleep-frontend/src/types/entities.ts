export type Option = {
  value: string;
  label: string;
};

export type SleepData = {
  _timestamp: string;
  _sleep_stage: string;
};

export type SleepWeekData = {
  id: number;
  quality: number;
  totalSleep: number;
};

export type SleepMonthData = {
  id: number;
  quality: number;
  totalSleep: number;
};

export type PercentageType = {
  stage: string;
  perc: number;
}