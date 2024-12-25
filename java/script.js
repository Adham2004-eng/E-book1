var anc = document.querySelector(".anc");
var icon =document.querySelector(".active")
console.log(icon);
icon.addEventListener("click",()=>{
    anc.classList.toggle("bigMenu");
})


//function:search box
 // This function will hide the items by default
 window.onload = function () {
    const listItems = document.querySelectorAll('#anchor-list li');
    listItems.forEach(item => {
        item.style.display = 'none'; // Initially hide all list items
    });
};

// This function is called every time the user types in the search bar
function filterAnchors() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase().trim();
    const listItems = document.querySelectorAll('#anchor-list li');
    let hasMatches = false; // Tracks whether there are matches or not

    listItems.forEach(listItem => {
        const anchor = listItem.querySelector('a'); // Get the anchor tag inside the list item
        const text = anchor.textContent.toLowerCase(); // Get the text content of the anchor

        // Show the item if it matches the search term
        if (searchTerm && text.includes(searchTerm)) {
            listItem.style.display = ''; // Show matching item
            hasMatches = true;
        } else {
            listItem.style.display = 'none'; // Hide non-matching item
        }
    });

    // Show or hide the result box based on matches
    const resultBox = document.querySelector('.result-box');
    resultBox.style.display = hasMatches ? 'block' : 'none';
}


//functuion:rating
document.addEventListener("DOMContentLoaded", function () {
    const stars = document.querySelectorAll(".star");

    stars.forEach((star) => {
        const ratingContainer = star.closest('.rating-container');
        const userRatingDisplay = ratingContainer.querySelector("#rating-value");
        const avgRatingDisplay = ratingContainer.querySelector("#average-rating");
        const removeRatingButton = ratingContainer.querySelector("#remove-rating");

        // Get the associated book title from the rating container
        const bookId = star.closest('.info') // Locate the section
            .querySelector('.txt h2').innerText.trim(); // Use the book title as a unique identifier

        const storedRating = localStorage.getItem(`book-${bookId}-rating`);
        const storedAvgRating = localStorage.getItem(`book-${bookId}-avg-rating`);

        if (storedRating) {
            userRatingDisplay.textContent = `Your Rating: ${storedRating}`;
            highlightStars(ratingContainer, storedRating);
        } else {
            userRatingDisplay.textContent = `Your Rating: 0`;
        }

        if (storedAvgRating) {
            avgRatingDisplay.textContent = `Average Rating: ${storedAvgRating}`;
        } else {
            avgRatingDisplay.textContent = `Average Rating: No ratings yet`;
        }

        star.addEventListener('click', function () {
            const ratingValue = parseInt(star.getAttribute('data-value'));
            localStorage.setItem(`book-${bookId}-rating`, ratingValue);
            userRatingDisplay.textContent = `Your Rating: ${ratingValue}`;
            highlightStars(ratingContainer, ratingValue);
            updateAverageRating(bookId, avgRatingDisplay);
        });

        function highlightStars(container, rating) {
            const stars = container.querySelectorAll('.star');
            stars.forEach((star, index) => {
                star.style.color = index < rating ? "gold" : "gray";
            });
        }

        function updateAverageRating(bookId, avgRatingDisplay) {
            const allRatings = [];
            document.querySelectorAll(".rating-container").forEach((container) => {
                const currentBookId = container.closest('.info')
                    .querySelector('.txt h2').innerText.trim();
                const currentRating = localStorage.getItem(`book-${currentBookId}-rating`);
                if (currentRating) {
                    allRatings.push(parseInt(currentRating));
                }
            });

            if (allRatings.length > 0) {
                const avgRating = (allRatings.reduce((acc, rating) => acc + rating, 0) / allRatings.length).toFixed(1);
                localStorage.setItem(`book-${bookId}-avg-rating`, avgRating);
                avgRatingDisplay.textContent = `Average Rating: ${avgRating}`;
            } else {
                avgRatingDisplay.textContent = `Average Rating: No ratings yet`;
                localStorage.removeItem(`book-${bookId}-avg-rating`);
            }
        }

        if (removeRatingButton) {
            removeRatingButton.addEventListener('click', function () {
                localStorage.removeItem(`book-${bookId}-rating`);
                userRatingDisplay.textContent = `Your Rating: 0`;
                highlightStars(ratingContainer, 0);
                updateAverageRating(bookId, avgRatingDisplay);
            });
        }
    });
});



//function location:

  // Function to fetch coordinates of the location using Nominatim
async function getCoordinates(location) {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
  const data = await response.json();
  if (data.length === 0) throw new Error("Location not found");
  return {
      lat: data[0].lat,
      lon: data[0].lon,
  };
}

// Function to find nearby bookstores using Overpass API
async function findNearbyBookstores(lat, lon) {
  const query = `
      [out:json];
      node
        ["shop"="books"]
        (around:5000, ${lat}, ${lon});
      out;
  `;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.elements || [];
}

// Main function triggered by the "Search" button
async function findBookstore() {
  const locationInput = document.getElementById('locationInput').value;
  if (!locationInput) {
      alert("Please enter a location.");
      return;
  }

  try {
      const { lat, lon } = await getCoordinates(locationInput);
      const bookstores = await findNearbyBookstores(lat, lon);
      displayResults(bookstores);
  } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
  }
}

// Function to get user's current location
function getUserLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const bookstores = await findNearbyBookstores(latitude, longitude);
          displayResults(bookstores);
      }, () => {
          alert("Unable to access your location.");
      });
  } else {
      alert("Geolocation is not supported by your browser.");
  }
}

// Function to display bookstore results
function displayResults(bookstores) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = "<h2>Nearest Bookstores:</h2>";

  if (bookstores.length === 0) {
      resultsDiv.innerHTML += "<p>No bookstores found nearby.</p>";
      return;
  }

  bookstores.forEach((store) => {
      resultsDiv.innerHTML += `
          <div>
              <strong>${store.tags.name || "Unnamed Bookstore"}</strong><br>
              Location: ${store.lat}, ${store.lon}<br>
              <hr>
          </div>
      `;
  });
}
