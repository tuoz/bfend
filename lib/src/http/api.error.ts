export class ApiError {
  constructor(public code: number, public msg: string, public payload?: any) {}

  toString() {
    return this.msg;
  }
}
