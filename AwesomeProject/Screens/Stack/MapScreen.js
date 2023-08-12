import { useRoute } from "@react-navigation/native";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapScreen() {
  const { params: { location, label, place } } = useRoute();

  return (
    <View style={styles.container}>
      <MapView
        style={{width: "100%", height: "100%"}}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        mapType="standard"
        minZoomLevel={15}        
      >
        <Marker
          title={label}
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          description={place}
        />

      </MapView>
    </View>
    
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});