import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [time, setTime] = useState(0); // Temps en minutes

  useEffect(() => {
    // Récupérer le temps au démarrage de l'app
    const loadTime = async () => {
      const storedTime = await AsyncStorage.getItem('todayTime');
      if (storedTime) {
        setTime(parseInt(storedTime));
      }
    };

    loadTime();
  }, []);

  const addTime = async (minutes: number) => {
    const newTime = time + minutes;
    setTime(newTime);
  
    // Récupérer les données existantes
    const storedData = await AsyncStorage.getItem('timeData');
    const timeData = storedData ? JSON.parse(storedData) : [];
  
    // Obtenir la date actuelle sous forme de chaîne (ex. 2024-11-22)
    const currentDate = new Date().toISOString().split('T')[0];
  
    // Vérifier si on a déjà des données pour cette date
    const existingDay = timeData.find((entry: { date: string }) => entry.date === currentDate);
  
    if (existingDay) {
      // Si des données existent pour ce jour, on met à jour le temps
      existingDay.time += minutes;
    } else {
      // Sinon, on ajoute une nouvelle entrée pour ce jour
      timeData.push({ date: currentDate, time: minutes });
    }
  
    // Sauvegarder dans AsyncStorage
    await AsyncStorage.setItem('timeData', JSON.stringify(timeData)); 
  };
  
  const subtractTime = async (minutes: number) => {
    const newTime = time - minutes >= 0 ? time - minutes : 0;
    setTime(newTime);
  
    // Récupérer les données existantes
    const storedData = await AsyncStorage.getItem('timeData');
    const timeData = storedData ? JSON.parse(storedData) : [];
  
    // Obtenir la date actuelle sous forme de chaîne
    const currentDate = new Date().toISOString().split('T')[0];
  
    // Vérifier si on a déjà des données pour cette date
    const existingDay = timeData.find((entry: { date: string }) => entry.date === currentDate);
  
    if (existingDay) {
      // Si des données existent pour ce jour, on met à jour le temps
      existingDay.time -= minutes;
    } else {
      // Sinon, on ajoute une nouvelle entrée pour ce jour
      timeData.push({ date: currentDate, time: -minutes });
    }
  
    // Sauvegarder dans AsyncStorage
    await AsyncStorage.setItem('timeData', JSON.stringify(timeData)); 
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Temps passé aujourd'hui : {time} minutes</Text>
      
      <View style={styles.buttonsContainer}>
        <Button title="+30 min" onPress={() => addTime(30)} />
        <Button title="-1h" onPress={() => subtractTime(60)} />
      </View>
      
      <Button
        title="Voir les Statistiques"
        onPress={() => navigation.navigate('Stats')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonsContainer: {
    marginBottom: 20,
  },
});
