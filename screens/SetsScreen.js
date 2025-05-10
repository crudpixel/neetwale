import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';

export default function SetsScreen({ route, navigation }) {
  const { subject } = route.params;
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`https://neet.crudpixel.tech/jsonapi/taxonomy_term/subjects?filter[parent.name]=${subject}`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.data.map(item => ({
          id: item.id,
          name: item.attributes.name
        }));
        setSets(formatted);
        setLoading(false);
      });
  }, [subject]);

  if (loading) return <ActivityIndicator />;

  return (
    <View style={{ padding: 20 }}>
      {sets.map(set => (
        <Button
          key={set.id}
          title={set.name}
          onPress={() => navigation.navigate('Questions', { setId: set.id })}
        />
      ))}
    </View>
  );
}
