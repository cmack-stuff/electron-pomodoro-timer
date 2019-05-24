import TimerUIStore, { TimerUIStoreModel } from "./timer-ui-store";
import { action, computed, observable } from "mobx";

export interface TimeInteval {
  hours?: number;
  minutes?: number;
  seconds: number;
}

class TimerStore {
  @observable timerUIStore: TimerUIStore;
  @observable startTime: number = 0;
  @observable elapsedTime: number = 0;
  timerFn: () => {};

  constructor(
    timeInteral: TimeInteval,
    uiState: TimerUIStoreModel = { radius: 90, circumference: 565 }
  ) {
    this.startTime = this.convertToSeconds(timeInteral);
    this.elapsedTime = this.startTime;
    this.timerUIStore = new TimerUIStore(uiState);
    this.startTimer = this.startTimer.bind(this);
    this.startTimer();
  }

  @action
  private convertToSeconds(interval: TimeInteval): number {
    const { hours, minutes, seconds } = interval;
    return hours! * 60 * 60 + minutes! * 60 + seconds;
  }

  @action.bound
  startTimer() {
    return new Promise(resolve => {
      this.timerFn = setInterval(() => {
        debugger;
        if (this.elapsedTime > 1) {
          this.elapsedTime--;
        } else {
          this.stopTimer();
          resolve();
        }
      }, 1000);
    });
  }

  @action
  stopTimer() {
    clearInterval(this.timerFn);
    if (this.elapsedTime !== 0) {
      this.elapsedTime = 0;
    }
  }

  @action
  pauseTimer() {
    clearInterval(this.timerFn);
  }

  @computed
  get getDashValue() {
    const { startTime, elapsedTime, timerUIStore } = this;
    const { circleCircumference } = timerUIStore;
    let dash = ((startTime - elapsedTime) / startTime) * circleCircumference;
    return dash;
  }

  @computed
  get getReadableTime() {
    const { elapsedTime } = this;
    let hours = Math.floor(elapsedTime / 3600);
    let minutes = Math.floor((elapsedTime / 60) % 60);
    let seconds = elapsedTime % 60;
    let timerArr = hours > 0 ? [hours, minutes, seconds] : [minutes, seconds];
    return this.constructReadableTime(timerArr);
  }

  constructReadableTime(timerArr: number[]): string {
    return timerArr.map(x => this.returnDoubleDigit(x)).join(":");
  }

  returnDoubleDigit(digit: number): string {
    return digit < 10 ? `0${digit}` : digit.toString();
  }
}

export default TimerStore;