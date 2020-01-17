import React from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import {
  requestPermissionsAsync,
  getCurrentPositionAsync
} from "expo-location";
import api from "../services/api";
export default class componentName extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      location: null,
      devs: []
    };

    this.loadInitialPosition();
    this.loadDevs();
  }

  async loadInitialPosition() {
    const { granted } = await requestPermissionsAsync();

    if (granted) {
      const { coords } = await getCurrentPositionAsync({
        enableHighAccuracy: true
      });

      const { latitude, longitude } = coords;

      this.setState({
        location: {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04
        }
      });
    }
  }

  async loadDevs() {
    const { latitude, longitude } = this.state.location;

    const response = await api.get("/devs", {
      params: {
        latitude,
        longitude,
        techs: "ReactJS"
      }
    });

    this.setState({
      devs: response.data
    });
  }

  handleRegionChange(region) {
    this.setState({
      location: region
    });
  }

  loadDevs() {}

  render() {
    return (
      <>
        <MapView
          onRegionChangeComplete={() => this.handleRegionChange.bind(this)}
          initialRegion={this.state.location}
          style={styles.map}
        >
          {this.state.devs.map(dev => (
            <Marker
              key={dev._id}
              coordinate={{
                longitude: dev.location.coordinates[0],
                latitude: dev.location.coordinates[1]
              }}
            >
              <Image
                style={styles.avatar}
                source={{
                  uri: dev.avatar_url
                }}
              ></Image>
              <Callout
                onPress={() => {
                  this.props.navigation.navigate("Profile", {
                    github_username: "diego3g"
                  });
                }}
              >
                <View style={styles.callout}>
                  <Text style={styles.devName}>{dev.name}</Text>
                  <Text style={styles.devBio}>{dev.bio}</Text>
                  <Text style={styles.devTech}>{dev.techs.join(", ")}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
        <View style={styles.searchForm}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar devs por techs..."
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoCorrect={false}
          ></TextInput>
          <TouchableOpacity onPress={this.loadDevs} style={styles.loadButton}>
            <MaterialIcons
              name="my-location"
              size={20}
              color="#fff"
            ></MaterialIcons>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: "#fff"
  },
  callout: {
    width: 260
  },
  devName: {
    fontWeight: "bold",
    fontSize: 16
  },
  devBio: {
    color: "#666",
    marginTop: 5
  },
  devTech: {
    marginTop: 5
  },
  searchForm: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: "row"
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "#fff",
    color: "#333",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4
    },
    elevation: 2
  },
  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: "#8e4dff",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15
  }
});
