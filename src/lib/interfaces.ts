
/**
 * Options used when initializing the tracker.
 */
 export type PlausibleInitOptions = {
  /**
   * Set to true if you want events to be tracked when running the app in __DEV__ mode
   */
  readonly trackDuringDevelopment?: boolean;
  /**
   * Set to true if you want the events to be logged to the console before being sent
   */
   readonly debug?: boolean;
  /**
   * The domain to bind the event to.
   */
  readonly domain: string;
  /**
   * The useragent string which is used to identify the user
   * Defaults to generated value using react-native-device-info
   */
  readonly userAgent?: string;
  /**
   * The API host where the events will be sent.
   * Defaults to `'https://plausible.io'`
   */
  readonly apiHost?: string;
};

/**
 * Data passed to Plausible as events.
 */
export type PlausibleEventData = {
  /**
   * The URL to bind the event to.
   * Defaults to `app://${await DeviceInfo.getBundleId()}/${screenName}`,
   */
  readonly url?: string;
  /**
   * The referrer "" bind the event to.
   * Defaults to null
   */
  readonly referrer?: string | null;
  /**
   * The current device's width.
   * Defaults to `Dimensions.get("window").width`
   */
  readonly deviceWidth?: number;
};

/**
 * Options used when tracking Plausible events.
 */
export type PlausibleOptions = PlausibleInitOptions & PlausibleEventData;
