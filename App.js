import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export default function App() {

  const [weather, setWeather] = useState({});
  const [location, setLocation] = useState({});

  useEffect(async () => {
    data = JSON.parse(await AsyncStorage.getItem("@weatherKey"));
    if (data) {
      setWeather(data);
    }
    else {
      getWeather();
    }
  }, [location]);


  useEffect(() => {
    (async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.granted === false) {
        throw new Error();
      }
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);


  const getWeather = async () => {
    try {
      const response = await fetch("http://api.openweathermap.org/data/2.5/forecast?lat=" + location.coords.latitude + "&lon=" + location.coords.longitude + "&appid=29c24adbe411001e3a3f70ae71e76c26&units=metric&langue=fr");
      const data = await response.json();
      // console.log(data);
      if (!data) {
        throw new Error();
      }
      await AsyncStorage.setItem("@weatherKey", JSON.stringify(data));
      setWeather(data);
    }
    catch (e) {
      console.log(e);
    }
  }

  const renderForecast = () => {

    const content = weather.list?.map((element, index) => {
      return (
        <View key={index}>
          <Text>Le {element.dt_txt}</Text>
          <Image style={{ height: 50, width: 50}} source={{ uri: "http://openweathermap.org/img/wn/" + element.weather?.[0].icon + "@2x.png" }} />
          <Text>Il fera {element.weather[0].description} Temperature entre {element.main.temp_min} °C et {element.main.temp_max} °C</Text>
        </View>
      );
    });
    return content;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.Text}>Météo</Text>
      <Text style={styles.Text1} >PREVISIONS SUR 5 JOURS</Text>
      <Button onPress={getWeather} title="Rafraichir"></Button>
      <Text>Ville : {location.name}</Text>
      <ScrollView>{renderForecast()}</ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  Text: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 20,
    borderBottomColor: "black",
  },
  Text1: {
    fontSize: 15,
    textAlign: "center",
    borderBottomColor: "black",
  },

});
