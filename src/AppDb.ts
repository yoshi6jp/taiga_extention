import Dexie from "dexie";
export interface IPomodoroHistory {
  id?: number;
  completedAt: Date;
  duration: number;
  pure: boolean;
  dateKey: string;
}
export interface IDailyTotal {
  id?: number;
  date: Date;
  value: number;
  pureValue: number;
  dateKey: string;
  dayOfWeek: number;
}
export class AppDatabase extends Dexie {
  items: Dexie.Table<IPomodoroHistory, number>;
  totals: Dexie.Table<IDailyTotal, number>;
  constructor() {
    super("TaigaPomodoroDatabase");
    this.version(1).stores({
      items: "++id, completedAt, duration, pure, dateKey",
      totals: "++id, date, value, pureValue, &dateKey, dayOfWeek"
    });
    this.items = this.table("items");
    this.totals = this.table("totals");
  }
}
export const db = new AppDatabase();
