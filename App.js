/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import CodePush from 'react-native-code-push';


import * as Sentry from '@sentry/react-native';

const App: () => React$Node = () => {
  const [syncMessage, setSyncMessage] = useState('');
  const [version, setVersion] = useState('');
  const [progress, setProgress] = useState(false);
  const [updateMeta, setUpdateMeta] = useState({});

  const codePushStatusDidChange = (syncStatus) => {
    switch(syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        setSyncMessage('Checking for update.');
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        setSyncMessage('Downloading package.');
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        setSyncMessage('Awaiting user action.');
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        setSyncMessage('Installing update.');
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        setSyncMessage('App up to date.');
        setProgress(false);
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        setSyncMessage('Update cancelled by user.');
        setProgress(false);
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        setSyncMessage('Update installed and will be applied on restart.');
        setProgress(false);
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        setSyncMessage('An unknown error occurred.');
        setProgress(false);
        break;
    }
  }

  const codePushDownloadDidProgress = (progress) => {
    setProgress(`Received ${progress.receivedBytes} of ${progress.totalBytes} total bytes.`);
  }

  const onButtonPress = () => {
    CodePush.sync(
      {}, 
      codePushStatusDidChange,
      codePushDownloadDidProgress,
    );
  }

  const onCrash = () => {
    Sentry.nativeCrash();
  }

  const onGetVersion = async () => {
    const update = await CodePush.getUpdateMetadata();
    setUpdateMeta(update);
  }

  const getVersionInfo = async () => {
    const update = await CodePush.getCurrentPackage();
    if (update) {
      setVersion(`${update.appVersion}-codepush:${update.label}`);
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>SyncMessage: {syncMessage}</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Progress: {progress}</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Meta: {JSON.stringify(updateMeta)}</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Version: ${version}</Text>
            </View>
            <TouchableOpacity style={styles.buttons} onPress={onButtonPress}>
              <Text>Update the app</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttons} onPress={onGetVersion}>
              <Text>Get Version</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttons} onPress={onCrash}>
              <Text>Crash the app</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttons} onPress={getVersionInfo}>
              <Text>Get Version</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  buttons: {
    flex: 1,
    display: 'flex',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'black',
    marginHorizontal: 10,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default CodePush(App);
