import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function FlashCardPdfScreen({ route }) {
  const { chapter } = route.params;
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pdfField = chapter.relationships.field_upload_pdf.data;
    if (pdfField) {
      const fileId = pdfField.id;
      fetch(`https://studyneet.crudpixel.tech/jsonapi/file/file/${fileId}`)
        .then(res => res.json())
        .then(fileData => {
          let url = fileData.data.attributes.uri.url;
          if (url && !url.startsWith('http')) {
            url = 'https://studyneet.crudpixel.tech' + url;
          }
          // Use Google Docs viewer (works on Android & iOS)
          setPdfUrl(`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`);
          setLoading(false);
        })
        .catch(() => {
          Alert.alert('PDF Error', 'Could not load flashcard PDF.');
          setLoading(false);
        });
    } else {
      Alert.alert('No PDF', 'No flashcard PDF available.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="blue" />;
  }

  return (
    <WebView
      source={{ uri: pdfUrl }}
      style={styles.webview}
      startInLoadingState
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});
