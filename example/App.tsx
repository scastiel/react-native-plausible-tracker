/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useRef} from 'react';
import {Button, Text, View} from 'react-native';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// import Plausible from 'react-native-plausible-tracker';
import Plausible from './plausible-lib';

const plausible = Plausible({
  domain: 'example.com',
  trackDuringDevelopment: true,
  debug: true,
});

function HomeScreen({navigation}: any) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>

      <Button
        title="Go to next screen"
        onPress={() => navigation.navigate('Nested')}
      />
    </View>
  );
}

function NestedScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Next Page!</Text>

      <Button
        title="Track event 'hello_world'"
        onPress={() => plausible.trackEvent('hello_world')}
      />
      <Button
        title="Track event 'hello_world' with other properties"
        onPress={() =>
          plausible.trackEvent('hello_world', {
            foo: 'bar',
          })
        }
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef<string>();

  useEffect(() => {
    plausible.trackEvent('app_loaded');
  }, []);

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
      }}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Nested" component={NestedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
