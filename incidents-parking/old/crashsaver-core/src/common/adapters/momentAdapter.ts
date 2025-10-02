import moment, {
  Moment,
  DurationInputArg1,
  DurationInputArg2,
} from "moment-timezone";

export class MomentAdapter {
  private utc!: string;
  constructor(utc: string) {
    this.utc = utc;
  }

  createUnix(date: string, format: string): number {
    return moment(date, format).locale("es").utcOffset(this.utc).unix();
  }

  convertDatetoUnix(date: Date) {
    return moment(date).locale("es").utcOffset(this.utc).unix();
  }

  createFormat(
    date: string,
    inputFormat: string,
    outputFormat: string,
  ): string {
    return moment(date, inputFormat)
      .locale("es")
      .utcOffset(this.utc)
      .format(outputFormat);
  }

  createFormatFromUnix(date: number, inputFormat: string): string {
    return moment(date, "X")
      .locale("es")
      .utcOffset(this.utc)
      .format(inputFormat);
  }

  date(): Date {
    return moment().locale("es").utcOffset(this.utc).toDate();
  }

  dateAddDays(days: number): Date {
    return moment().add({ d: days }).locale("es").utcOffset(this.utc).toDate();
  }

  getYear(): number {
    return moment().locale("es").utcOffset(this.utc).year();
  }

  getMonth(): number {
    return moment().locale("es").utcOffset(this.utc).month();
  }

  getDay(): number {
    return moment().locale("es").utcOffset(this.utc).day();
  }

  getHour(): number {
    return moment().locale("es").utcOffset(this.utc).hour();
  }

  dateFormatDDMMYYY(): string {
    return moment().locale("es").utcOffset(this.utc).format("DD-MM-YYYY");
  }

  dateFormatMMYYY(): string {
    return moment().locale("es").utcOffset(this.utc).format("MM-YYYY");
  }

  dateUnix(): number {
    return moment().locale("es").utcOffset(this.utc).unix();
  }

  config(): Moment {
    return moment().locale("es").utcOffset(this.utc);
  }

  getTimeUnixSubstract(
    amount: DurationInputArg1,
    unitTime: DurationInputArg2,
  ): number {
    return moment()
      .locale("es")
      .utcOffset(this.utc)
      .subtract(amount, unitTime)
      .unix();
  }

  createMoment(unix: number) {
    return moment(unix * 1000).utcOffset(this.utc);
  }

  createUnixFromString(date: string) {
    return moment(date).utcOffset(this.utc).unix();
  }

  dateMoment(): Moment {
    return moment().utcOffset(this.utc);
  }

  range(init: Moment | Date, finish: Moment | Date) {
    const date = this.dateMoment();
    const contains = moment(date).isBetween(init, finish);
    return contains;
  }

  isAfter(executeTime: Moment | Date): boolean {
    const date = this.dateMoment();
    const contains = moment(date).isAfter(executeTime);
    return contains;
  }
}
