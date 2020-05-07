/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://c2657e1e6de34debaaee248121af3777@o135600.ingest.sentry.io/5227513',
});

console.log(Sentry.SDK_VERSION);

AppRegistry.registerComponent(appName, () => App);
