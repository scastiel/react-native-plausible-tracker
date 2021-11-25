# react-native-plausible-tracker

## Installation

```sh
yarn add react-native-plausible-tracker
# or
npm install --save react-native-plausible-tracker
```

Don't forget to install the peerDependencies if not already in use:

```sh
yarn add react-native-device-info
# or
npm install --save react-native-device-info
```

## Usage

See full example at [example/App.tsx](example/App.tsx)

```typescript
import Plausible from 'react-native-plausible-tracker';

const plausible = Plausible({
  domain: 'example.com', // TODO: Replace this with your domain on Plausible.io
  // trackDuringDevelopment: true,
  // debug: true,
});


// Elsewhere in your code
export const MyComponent() {
  useEffect(() => {
    plausible.trackEvent('my_component_loaded');
  }, []);

  const onNavigateToPaymentScreen
    plausible.trackScreen('PaymentScreen');
  }, []);
}
```

### Automatic tracking for React Native Navigation

This is mostly based on https://reactnavigation.org/docs/screen-tracking/

```typescript
function App() {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef<string>();

  const plausible = Plausible({
    domain: 'example.com',
  });

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef?.getCurrentRoute()?.name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef?.getCurrentRoute()?.name;

        if (currentRouteName && previousRouteName !== currentRouteName) {
          await plausible.trackScreen(currentRouteName);
        }

        // Save the current route name for later comparison
        routeNameRef.current = currentRouteName;
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Nested" component={NestedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## Contributing

### Publishing to NPM

Maintainers should use [np](https://github.com/sindresorhus/np) for publishing to NPM
