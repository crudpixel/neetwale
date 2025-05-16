import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator,TouchableOpacity, StyleSheet,ScrollView } from 'react-native';


export default function SetsScreen({ route, navigation }) {
  const { subject } = route.params;
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://studyneet.crudpixel.tech/jsonapi/taxonomy_term/subjects?filter[parent.name]=${subject}`)
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
    <ScrollView>
    <View style={{ padding: 20 }}>
      {sets.map(set => (
        // <Button
        //   key={set.id}
        //   title={set.name}
        //   onPress={() => navigation.navigate('Questions', { setId: set.id })}
        // />
                <TouchableOpacity
                  key={set.id}
                  
                  style={styles.card}
                  onPress={() => navigation.navigate('Questions', { setId: set.id })}
                >
                  <Text style={styles.cardText}>{set.name}</Text>
                </TouchableOpacity>
      ))}
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // justifyContent: 'space-between',
  },

  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
