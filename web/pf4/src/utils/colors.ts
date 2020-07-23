export default class Colors {
  private idx = 0;
  constructor(private colors: string[]) {}

  next(): string {
    const next = this.colors[this.idx % this.colors.length];
    this.idx++;
    return next;
  }
}
