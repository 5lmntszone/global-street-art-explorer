import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiYmxpdHpibGl0enkiLCJhIjoiY21lYmRzdGJlMTJqMjJrcXg5ODZubzM1aiJ9.rlTnuvwtOByjWqtdeG4LxA';

let allArtworks = []; 
let markerMap = new Map(); 

async function initMap() {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [13.405, 52.52],
    zoom: 2.5,
  });

  map.addControl(new mapboxgl.NavigationControl());

  try {
    const res = await fetch('data/artworks.json');
    allArtworks = await res.json();
    renderGallery(allArtworks);

    allArtworks.forEach((art) => {
      const lat = parseFloat(art.location?.lat);
      const lng = parseFloat(art.location?.lng);

      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
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

      const marker = new mapboxgl.Marker({ color: '#00f0b5' })
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
        .addTo(map);

      marker.getElement().addEventListener('click', () => {
        highlightArtwork(art.id);
      });

      markerMap.set(art.id, marker);
    });
  } catch (err) {
    console.error('Error loading map data:', err);
  }
}

function renderGallery(artworks) {
  const galleryGrid = document.getElementById('gallery-grid');
  galleryGrid.innerHTML = '';

  artworks.forEach((art) => {
    const card = document.createElement('div');
    card.classList.add('gallery-item');
    card.dataset.id = art.id;

    card.innerHTML = `
      <img src="${art.image_url}" alt="Artwork by ${art.artist}" />
      <div class="info">
        <h3>${art.title}</h3>
        <p><strong>Artist:</strong> ${art.artist}</p>
        <p><strong>City:</strong> ${art.location.city}</p>
      </div>
    `;

    galleryGrid.appendChild(card);
  });
}

function highlightArtwork(id) {
  // Remove previous highlights
  document.querySelectorAll('.gallery-item').forEach((item) =>
    item.classList.remove('highlight')
  );

  // Highlight and scroll to the selected item
  const item = document.querySelector(`.gallery-item[data-id="${id}"]`);
  if (item) {
    item.classList.add('highlight');
    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function setupFiltering() {
  const input = document.getElementById('search');
  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();

    const filtered = allArtworks.filter((art) => {
      return (
        art.location.city.toLowerCase().includes(query) ||
        art.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });

    renderGallery(filtered);
  });
}

initMap();
setupFiltering();
