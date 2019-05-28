import { EventEmitter } from "events";
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
  constructor(tick: number) {
    super();
    this.tick = tick;
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
    return this.duration - this.elapsed;
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

    this.emit("start", this.status);
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
}

export const timer = new Timer(60);
