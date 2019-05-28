import { EventEmitter } from "events";
import _ from "lodash";
export enum TimerState {
  STOPPED = "stopped",
  RUNNING = "running",
  PAUSED = "paused"
}
export enum TimerMode {
  FOCUS = "Focusing",
  SHORT = "Short break",
  LONG = "Long break"
}
export const TimerDurationMin = {
  [TimerMode.FOCUS]: 25,
  [TimerMode.SHORT]: 5,
  [TimerMode.LONG]: 15
};
enum StorageKey {
  STATE = "pomodoro_state",
  MODE = "pomodoro_mode",
  CHECKPOINT_START_AT = "pomodoro_checkpoint_start_at",
  CHECKPOINT_ELAPSED = "pomodoro_checkpoint_elapsed"
}
const isValidState = (val: string | null) =>
  _.includes(_.values(TimerState), val);

const isValidMode = (val: string | null) =>
  _.includes(_.values(TimerMode), val);

type TimerEvents =
  | "start"
  | "stop"
  | "pause"
  | "resume"
  | "expire"
  | "tick"
  | "change_mode";
interface ITimerStatus {
  state: TimerState;
  duration: number;
  elapsed: number;
  remaining: number;
  checkpointElapsed: number;
  checkpointStartAt: number;
  mode: TimerMode;
}
export type TimerEventListener = (status: ITimerStatus) => void;
class Timer extends EventEmitter {
  state: TimerState = TimerState.STOPPED;
  mode: TimerMode = TimerMode.FOCUS;
  duration: number = TimerDurationMin[TimerMode.FOCUS] * 60;
  tick: number = 60;
  checkpointStartAt: number = NaN;
  checkpointElapsed: number = 0;
  expireTimeout: NodeJS.Timeout | null = null;
  tickInterval: NodeJS.Timeout | null = null;
  restoreExpired = false;
  constructor(tick: number) {
    super();
    this.tick = tick;
    this.restoreStorage();
  }
  get isStopped() {
    return this.state === TimerState.STOPPED;
  }
  get isRunning() {
    return this.state === TimerState.RUNNING;
  }
  get isPaused() {
    return this.state === TimerState.PAUSED;
  }
  get remaining() {
    return Math.max(this.duration - this.elapsed, 0);
  }

  get elapsed() {
    let periodElapsed = 0;
    if (this.checkpointStartAt && this.isRunning) {
      periodElapsed = (Date.now() - this.checkpointStartAt) / 1000;
    }
    return this.checkpointElapsed + periodElapsed;
  }
  get status(): ITimerStatus {
    return {
      state: this.state,
      duration: this.duration,
      elapsed: this.elapsed,
      remaining: this.remaining,
      checkpointElapsed: this.checkpointElapsed,
      checkpointStartAt: this.checkpointStartAt,
      mode: this.mode
    };
  }
  on(event: TimerEvents, listener: TimerEventListener) {
    return super.on(event, listener);
  }
  once(event: TimerEvents, listener: TimerEventListener) {
    return super.once(event, listener);
  }
  start() {
    if (!this.isStopped) {
      return;
    }
    this.setExpireTimeout(this.duration);
    this.setTickInterval(this.tick);

    this.state = TimerState.RUNNING;
    this.checkpointStartAt = Date.now();
    this.checkpointElapsed = 0;

    this.emit("start", this.status);

    this.saveStorage();
  }
  stop() {
    if (this.isStopped) {
      return;
    }
    this.clearExpireTimeout();
    this.clearTickInterval();

    this.checkpointStartAt = NaN;
    this.checkpointElapsed = 0;

    this.state = TimerState.STOPPED;

    this.emit("stop", this.status);

    this.saveStorage();
  }
  pause() {
    if (!this.isRunning) {
      return;
    }

    this.clearExpireTimeout();
    this.clearTickInterval();

    let periodElapsed = (Date.now() - this.checkpointStartAt) / 1000;
    this.checkpointElapsed += periodElapsed;

    this.state = TimerState.PAUSED;

    this.emit("pause", this.status);

    this.saveStorage();
  }
  resume() {
    if (!this.isPaused) {
      return;
    }
    this.setExpireTimeout(this.remaining);
    this.setTickInterval(this.tick);

    this.state = TimerState.RUNNING;
    this.checkpointStartAt = Date.now();

    this.emit("resume", this.status);

    this.saveStorage();
  }
  restart() {
    this.stop();
    this.start();
  }
  changeMode(mode: TimerMode) {
    this.stop();
    this.mode = mode;
    this.duration = TimerDurationMin[mode] * 60;

    this.emit("change_mode", this.status);

    this.saveStorage();
  }
  setExpireTimeout(seconds: number) {
    this.expireTimeout = setTimeout(() => {
      this.clearTickInterval();
      this.clearExpireTimeout();

      this.checkpointStartAt = Date.now();
      this.checkpointElapsed = this.duration;

      this.state = TimerState.STOPPED;

      this.emit("expire", this.status);
    }, seconds * 1000);
  }
  clearExpireTimeout() {
    if (this.expireTimeout) {
      clearTimeout(this.expireTimeout);
    }
    this.expireTimeout = null;
  }
  setTickInterval(seconds: number) {
    this.tickInterval = setInterval(() => {
      this.emit("tick", this.status);
    }, seconds * 1000);
  }
  clearTickInterval() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
    this.tickInterval = null;
  }
  saveStorage() {
    localStorage.setItem(StorageKey.STATE, this.state);
    localStorage.setItem(StorageKey.MODE, this.mode);
    localStorage.setItem(
      StorageKey.CHECKPOINT_START_AT,
      Number.isNaN(this.checkpointStartAt) ? "" : String(this.checkpointStartAt)
    );
    localStorage.setItem(
      StorageKey.CHECKPOINT_ELAPSED,
      String(this.checkpointElapsed)
    );
  }
  restoreStorage() {
    const lsState = localStorage.getItem(StorageKey.STATE);
    const lsMode = localStorage.getItem(StorageKey.MODE);
    const lsCpStartAt = localStorage.getItem(StorageKey.CHECKPOINT_START_AT);
    const lsCpElapsed = localStorage.getItem(StorageKey.CHECKPOINT_ELAPSED);
    if (isValidState(lsState) && isValidMode(lsMode)) {
      const state = lsState as TimerState;
      const mode = lsMode as TimerMode;
      const duration = TimerDurationMin[mode] * 60;
      switch (state) {
        case TimerState.STOPPED: {
          this.changeMode(mode);
          break;
        }
        case TimerState.PAUSED: {
          const cpElapsed = Number(lsCpElapsed);
          if (cpElapsed < duration * 1000) {
            this.state = state;
            this.mode = mode;
            this.duration = duration;
            this.checkpointElapsed = cpElapsed;
          }
          break;
        }
        case TimerState.RUNNING: {
          const cpStartAt = Number(lsCpStartAt);
          const cpElapsed = Number(lsCpElapsed);
          if (cpStartAt > 0) {
            this.mode = mode;
            this.duration = duration;
            const elapsedMsec = Date.now() - cpStartAt + cpElapsed * 1000;
            if (elapsedMsec < duration * 1000) {
              this.state = TimerState.RUNNING;

              this.checkpointStartAt = cpStartAt;
              this.checkpointElapsed = cpElapsed;

              this.setExpireTimeout(this.remaining);
              this.setTickInterval(this.tick);
            } else {
              this.checkpointStartAt = Date.now();
              this.checkpointElapsed = this.duration;

              this.state = TimerState.STOPPED;

              this.restoreExpired = true;
            }
          }
          break;
        }
      }
    }
  }
}

export const timer = new Timer(60);
