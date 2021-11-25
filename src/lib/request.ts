import { PlausibleOptions } from "..";

type EventPayload = {
  readonly n: string;
  readonly u: string;
  readonly d: string;
  readonly r: string | null;
  readonly w: number;
  readonly p?: string;
};


export type SendEventOptions = {
  eventName: string;
  eventProps?: any;
  options: Required<PlausibleOptions>;
};

export async function sendEvent({
  eventName,
  eventProps,
  options,
}: SendEventOptions): Promise<void> {
  const { trackDuringDevelopment } = options;
  if (!trackDuringDevelopment && __DEV__) {
    return console.warn(
      '[Plausible] Ignoring event because app is running in development'
    );
  }

  const payload: EventPayload = {
    n: eventName,
    u: options.url,
    d: options.domain,
    r: options.referrer,
    w: options.deviceWidth,
    p: eventProps ? JSON.stringify(eventProps) : undefined,
  };

  const apiUrl = `${options.apiHost}/api/event`;

  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': options.userAgent,
    "X-Forwarded-For": "127.0.0.1",
  }

  if (options.debug) {
    console.debug("Plausible request: ", JSON.stringify({ apiUrl, headers, payload}, null, 2))
  }

  await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  }).then(res => res.text()).then(res => {
    console.log("Plausible API response: ", { text: res})
    return res;
  }).catch(e => {
    console.log("Plausible API error: ", { error: e.message})
    throw e;
  });
}
