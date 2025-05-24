import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PDFScreen({ route }) {
  const { title, url } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      {/* Optional header, remove if not needed */}
      {/* <Text style={styles.header}>{title}</Text> */}

      <WebView
        source={{ uri: url }}
        style={styles.webview}
        startInLoadingState
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        scalesPageToFit
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
  },
  header: {
    fontSize: 18,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
