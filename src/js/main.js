import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiYmxpdHpibGl0enkiLCJhIjoiY21lYmRzdGJlMTJqMjJrcXg5ODZubzM1aiJ9.rlTnuvwtOByjWqtdeG4LxA';

async function initMap() {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [13.405, 52.52], // Berlin
    zoom: 2.5,
  });

  map.addControl(new mapboxgl.NavigationControl());

  try {
    const res = await fetch('data/artworks.json');
    const artworks = await res.json();

    artworks.forEach((art) => {
      const lat = parseFloat(art.location?.lat);
      const lng = parseFloat(art.location?.lng);

      if (
        isNaN(lat) || isNaN(lng) ||
        lat < -90 || lat > 90 ||
        lng < -180 || lng > 180
      ) {
        console.warn(`Invalid coordinates for artwork: ${art.title}`);
        return;
      }

      const popupContent = `
        <div class="popup">
          <h3>${art.title}</h3>
          <p><strong>Artist:</strong> ${art.artist}</p>
          <p><strong>Location:</strong> ${art.location.city}, ${art.location.country}</p>
          <p><strong>Date:</strong> ${art.date_created}</p>
          <p><strong>Tags:</strong> ${art.tags?.join(', ')}</p>
        </div>
      `;

      new mapboxgl.Marker({ color: '#00f0b5' })
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
        .addTo(map);
    });
  } catch (err) {
    console.error('Error loading map data:', err);
  }
}

initMap();
