import React, { useState, useEffect } from 'react';
import Autocomplete from './Autocomplete';
import "../../styles/Map.scss";
import FavouritesMap from './FavouritesMap';
import Switch from '@material-ui/core/Switch';

const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
// load google map script
const loadGoogleMapScript = (callback) => {
  if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
    callback();
  } else {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`;
    window.document.body.appendChild(googleMapScript);
    googleMapScript.addEventListener("load", callback);
  }
};

export default function Map() {
  const [loadMap, setLoadMap] = useState(false);
  const [searchOn, setSearchOn] = useState(false);

  const handleChange = (event) => {
    setSearchOn(!searchOn);
  };

  useEffect(() => {
    loadGoogleMapScript(() => {
      setLoadMap(true);
    });
  }, []);

  return (
    <div id="map-page">
      <div id="toggle">
        <h2>Favourites</h2>
        <Switch
          selection={searchOn}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
        <h2>Search</h2>
      </div>
      {!loadMap && <div>Loading...</div> }
      {searchOn && <Autocomplete />}
      {!searchOn && <FavouritesMap />}
    </div>
  )
}
