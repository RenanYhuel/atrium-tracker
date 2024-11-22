import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StatsScreen = () => {
    const [timeData, setTimeData] = useState<{ date: string, time: number }[]>([]);

    useEffect(() => {
    // Charger les données stockées (temps pour chaque jour avec la date)
    const loadTimeData = async () => {
        const storedData = await AsyncStorage.getItem('timeData');
        if (storedData) {
        setTimeData(JSON.parse(storedData)); // Convertir le JSON en tableau
        }
    };

    loadTimeData();
    }, []);

    return (
    <View style={styles.container}>
        <Text style={styles.title}>Statistiques des heures passées</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        {timeData.length === 0 ? (
            <Text>Aucune donnée enregistrée.</Text>
        ) : (
            timeData.map((entry, index) => (
            <View key={index} style={styles.dayContainer}>
                <Text>{entry.date} : {entry.time} minutes</Text>
            </View>
            ))
        )}
        </ScrollView>
    </View>
    );
};
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  dayContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 5,
  },
});

export default StatsScreen;
