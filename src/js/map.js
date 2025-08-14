import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiYmxpdHpibGl0enkiLCJhIjoiY21lYmRzdGJlMTJqMjJrcXg5ODZubzM1aiJ9.rlTnuvwtOByjWqtdeG4LxA';

export async function initMap() {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [13.405, 52.52],
    zoom: 2.3
  });

  map.addControl(new mapboxgl.NavigationControl());

  try {
    const res = await fetch('/data/artworks.json');
    const artworks = await res.json();

    artworks.forEach((art) => {
      if (!art.location || !art.location.lat || !art.location.lng) return;

      const popupContent = `
        <div class="popup">
          <h3>${art.title}</h3>
          <p><strong>Artist:</strong> ${art.artist}</p>
          <p><strong>Location:</strong> ${art.location.city}, ${art.location.country}</p>
          <p><strong>Date:</strong> ${art.date_created}</p>
          <p><strong>Tags:</strong> ${art.tags.join(', ')}</p>
        </div>
      `;

      new mapboxgl.Marker({ color: '#00f0b5' })
        .setLngLat([art.location.lng, art.location.lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
        .addTo(map);
    });
  } catch (error) {
    console.error('Failed to load map markers:', error);
  }
}
