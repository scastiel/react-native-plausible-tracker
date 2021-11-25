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
  const { trackDuringDevelopment, debug } = options;

  const debugLogger = {
    warn: (...args: any[]) => (debug && console.warn(
      ...args
    )),
    debug: (...args: any[]) => (debug && console.debug(
      ...args
    ))
  }

  if (!trackDuringDevelopment && __DEV__) {
    debugLogger.warn(
      '[Plausible] Ignoring event because app is running in development'
    );
    return;
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

  debugLogger.debug("Plausible request: ", JSON.stringify({ apiUrl, headers, payload}, null, 2))

  await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  }).then(res => res.text()).then(res => {
    debugLogger.debug("Plausible API response: ", { text: res})
    return res;
  }).catch(e => {
    debugLogger.debug("Plausible API error: ", { error: e.message})
    throw e;
  });
}
