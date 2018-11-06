import React from 'react';
import {compose, withProps} from 'recompose';
import {GoogleMap, Marker, withGoogleMap, withScriptjs} from 'react-google-maps';
import UserPoint from '../UserMapPoint.svg';

const ShelterMap = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_MAP}`,
    loadingElement: <div style={{height: `100%`}}/>,
    containerElement: <div style={{height: `400px`}}/>,
    mapElement: <div style={{height: `100%`}}/>,
  }),
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap
    defaultZoom={15}
    defaultCenter={props.myPosition}
  >
    <Marker
      icon={{
        url: UserPoint,
        scaledSize: new window.google.maps.Size(60, 40),
      }}
      position={props.myPosition}
    />
    {props.shelters ?
      props.shelters.map((shelter, key) => (
        <Marker
          key={key}
          title={shelter.name}
          position={{
            lat: shelter.lat,
            lng: shelter.lon,
          }}
          onClick={() => props.pickShelter(shelter)}
        />
      )) : null
    }
  </GoogleMap>
));

export default ShelterMap;
