import React from 'react';
import {compose, withProps} from 'recompose';
import {GoogleMap, Marker, withGoogleMap, withScriptjs} from 'react-google-maps';

export const MapComponent = compose(
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
    <Marker position={props.myPosition}/>
  </GoogleMap>
));
