import { sendEvent } from './request';
import { Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  PlausibleEventData,
  PlausibleInitOptions,
  PlausibleOptions,
} from './interfaces';

/**
 * Tracks a custom event.
 *
 * Use it to track your defined goals by providing the goal's name as `eventName`.
 *
 * ### Example
 * ```js
 * import Plausible from 'react-native-plausible-tracker'
 *
 * const { trackEvent } = Plausible({
 *   domain: "example.com"
 * })
 *
 * // Tracks the 'signup' goal
 * trackEvent('signup')
 *
 * // Tracks the 'Download' goal passing a 'method' property.
 * trackEvent('Download', { method: 'HTTP' })
 * ```
 *
 * @param eventName - Name of the event to track
 * @param eventProps - Event properties.
 * @param options - Optional event data to send.
 */
type TrackEvent = (
  eventName: string,
  eventProps?: { [key: string]: string },
  options?: PlausibleEventData
) => void;

/**
 * Manually tracks a page view.
 *
 * ### Example
 * ```js
 * import Plausible from 'react-native-plausible-tracker'
 *
 * const { trackEvent } = Plausible({
 *   domain: "example.com"
 * })
 *
 * // Track a page view
 * trackScreen("HomeScreen")
 * ```
 *
 * @param screenName - The name of the current screen
 * @param eventProps - Event properties.
 * @param options - Event options.
 */
type TrackScreen = (
  screenName: string,
  eventProps?: { [key: string]: string },
  options?: PlausibleEventData
) => void;

/**
 * Initializes the tracker with your default values.
 *
 * ### Example
 * ```js
 * import Plausible from 'react-native-plausible-tracker'
 *
 * const { trackEvent } = Plausible({
 *   domain: 'example.com',
 * })
 *
 *
 * function onUserRegister() {
 *   trackEvent('register')
 * }
 * ```
 * @param defaults - Default event parameters that will be applied to all requests.
 */
export default function Plausible(
  defaults: PlausibleInitOptions
): {
  readonly trackEvent: TrackEvent;
  readonly trackScreen: TrackScreen;
} {
  const getUrlForScreenName = async (screenName: string) => {
    return `app://${await DeviceInfo.getBundleId()}/${screenName}`;
  };

  const getUserAgent = async (): Promise<string> => {
    return await DeviceInfo.getUserAgent();
  };

  const getConfig = async (): Promise<Required<PlausibleOptions>> => ({
    trackDuringDevelopment: false,
    debug: false,
    url: '',
    referrer: null,
    deviceWidth: Dimensions.get('window').width,
    userAgent: await getUserAgent(),
    apiHost: 'https://plausible.io',
    ...defaults,
  });

  const trackEvent: TrackEvent = async (eventName, props, options) => {
    sendEvent({
      eventName,
      eventProps: props,
      options: {
        ...(await getConfig()),
        ...options,
      },
    });
  };

  const trackScreen: TrackScreen = async (screenName, props, options) => {
    await trackEvent('pageview', props, {
      url: await getUrlForScreenName(screenName),
      ...options,
    });
  };

  return {
    trackEvent,
    trackScreen,
  };
}
