import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PDFScreen({ route }) {
  const { title, url } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        startInLoadingState
        originWhitelist={['*']}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    fontSize: 18,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
    margin: 10,
  },
});
