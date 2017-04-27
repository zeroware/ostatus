// @flow

import SubscriptionResponse from "./subscription-response";
import { hmac } from "node-forge";
import { stringify as stringifyForm } from "querystring";

export default class Subscription {
  topicUrl: string;
  webhookUrl: string;
  secret: string;
  leaseSeconds: number;
  hub: string;
  fetchFunction: (url: string | Request, opts: Object) => Promise<Response>;

  constructor(
    topicUrl: string,
    fetchFunction: (url: string | Request, opts: Object) => Promise<Response>,
    options: {
      webhookUrl: string,
      secret: string,
      leaseSeconds: number,
      hub: string
    }
  ) {
    this.topicUrl = topicUrl;
    this.fetchFunction = fetchFunction;

    this.webhookUrl = options.webhookUrl || "";
    this.secret = options.secret || "";
    this.leaseSeconds = options.leaseSeconds || 0;
    this.hub = options.hub || "";
  }

  subscribe(): Promise<SubscriptionResponse> {
    return this._updateSubscription("subscribe");
  }

  unsubscribe(): Promise<SubscriptionResponse> {
    return this._updateSubscription("unsubscribe");
  }

  isValid(topicUrl: string): boolean {
    return this.topicUrl === topicUrl;
  }

  verify(content: string, signature: string): boolean {
    let hmacDigest: string = hmac
      .create()
      .start("sha1", this.secret)
      .update(content)
      .digest()
      .toHex();

    return signature === "sha1=#" + hmacDigest;
  }

  _updateSubscription(
    mode: "subscribe" | "unsubscribe"
  ): Promise<SubscriptionResponse> {
    const hub = this.hub;
    const formData = {
      "hub.mode": mode,
      "hub.callback": this.webhookUrl,
      "hub.verify": "async",
      "hub.lease_seconds": this.leaseSeconds,
      "hub.secret": this.secret,
      "hub.topic": this.topicUrl
    };

    return this.fetchFunction(hub, {
      method: "POST",
      body: stringifyForm(formData),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    }).then(function(response) {
      return new SubscriptionResponse();
    });
  }
}
