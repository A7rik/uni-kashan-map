//variables

var scale = 1,
  panning = false,
  realPanning = false,
  pointX = 0,
  pointY = 0,
  start = { x: 0, y: 0 },
  zoom = document.getElementById("zoom"),
  rooms = document.querySelectorAll(".rooms"),
  infoOverlay = document.getElementById("infoOverlay"),
  searchInput = document.getElementById("search-input"),
overlayCloseButton = document.getElementById("direction-close-button"),
placeNameH1=document.querySelector(".placeName");

////////////

//functions
//////////////////
//right panel functions
//room clicking function
function roomClick(e) {
  if (!realPanning) {
    const roomName = e.target.getAttribute("room-name");
   
    searchInput.value = roomName;
    placeNameH1.textContent=roomName;
    infoOverlay.style.right = "0";
    overlayCloseButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';

    ///google direction
    const roomGoogleLocation = e.target.getAttribute("room-google-location");
    const googleDirection = document.getElementById("googleDirectionBt");
    googleDirection.addEventListener("click", function() {
    
      // Open a new tab with the specified URL
      window.open(roomGoogleLocation, "_blank");
  });
  }
}

//right panel person section
const sectionButtons = document.querySelectorAll('.section-button');
const sections = document.querySelectorAll('.section');

sectionButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Hide all sections
        sections.forEach(section => {
            section.style.display = 'none';
        });

        // Show the selected section
        const sectionId = button.getAttribute('data-section');
        document.getElementById(sectionId).style.display = 'block';
    });
});



//hide right panel
function hideInfoOverlay(e) {
  infoOverlay.style.right = "-100%";
  searchInput.value = "";
  overlayCloseButton.innerHTML =
    '<i class="fa-solid fa-diamond-turn-right fa-flip-horizontal"></i>';
}

//////////////
//move and zoom functions
function setTransform() {
  zoom.style.transform =
    "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
}

function startPanning(e) {
  e.preventDefault();
  if (e.touches && e.touches.length === 1) {
    start = {
      x: e.touches[0].clientX - pointX,
      y: e.touches[0].clientY - pointY,
    };
    panning = true;
  } else if (!e.touches) {
    start = { x: e.clientX - pointX, y: e.clientY - pointY };
    panning = true;
  }
}

function endPanning(e) {
  setTimeout(() => {
    realPanning = false;
  }, 0);
  panning = false;
}

function movePanning(e) {
  e.preventDefault();
  if (panning && ((e.touches && e.touches.length === 1) || !e.touches)) {
    if (e.touches) {
      pointX = e.touches[0].clientX - start.x;
      pointY = e.touches[0].clientY - start.y;
      realPanning = true;
    } else {
      pointX = e.clientX - start.x;
      pointY = e.clientY - start.y;
      realPanning = true;
    }
    setTransform();
  }
}

function zoomHandler(e) {
  e.preventDefault();
  var xs = (e.clientX - pointX) / scale,
    ys = (e.clientY - pointY) / scale,
    delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
  delta > 0 ? (scale *= 1.2) : (scale /= 1.2);
  pointX = e.clientX - xs * scale;
  pointY = e.clientY - ys * scale;

  setTransform();

  if (scale >= 1.8) {
    rooms.forEach(function (rooms1) {
      rooms1.style.visibility = "visible";
      rooms1.style.opacity = 1;
    });
  } else {
    rooms.forEach(function (rooms1) {
      rooms1.style.visibility = "hidden";
      rooms1.style.opacity = 0;
    });
  }
}

//////////////////////
//adding event listeners
zoom.addEventListener("mousedown", startPanning);
zoom.addEventListener("mouseup", endPanning);
zoom.addEventListener("mousemove", movePanning);

zoom.addEventListener("touchstart", startPanning);
zoom.addEventListener("touchend", endPanning);
zoom.addEventListener("touchmove", movePanning);

zoom.addEventListener("wheel", zoomHandler);

rooms.forEach((room) => {
  room.addEventListener("click", roomClick);
  room.addEventListener("touchstart", roomClick);
});
overlayCloseButton.addEventListener("click", hideInfoOverlay);

//////////////////////


