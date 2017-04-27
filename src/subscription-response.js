// @flow

export default class SubscriptionResponse {
  code: number;
  body: string;

  constructor(code: number, body: string) {
    this.code = code;
    this.body = body;
  }

  isSuccessful(): boolean {
    return this.code === 202;
  }

  isFailed(): boolean {
    return !this.isSuccessful();
  }

  getMessage(): string {
    return this.body;
  }

  getBody(): string {
    return this.body;
  }

  getCode(): number {
    return this.code;
  }
}
