# Muslim-Calendar
Muslim Calendar is a web app which used to give information related of Islamic Calendar, Prayer Times and Imsakiyah Schedule, Moon Crescent Visibility Map, and also Solar and Lunar Eclipses around The World.

#### This Project is still in WIP (Work In Progress...) and might still produces any unexpected result.
#### Currently some features Might Not Supported for:
- Prayer Times in Higher Latitudes
- New Moon Observation Date must be Set Based on Its Location Time Zone and Location is not in Higher Latitude (for preventing any invalid Hijri Date which could be exceeded to 31 days or only 28 days in some months)
- Hijri Dates in Western Region
- Input Date before October 15, 1582 or in Julian Calendar Era (only support for Gregorian Calendar)
- Qibla direction with compass may not be accurate because it depends on earth magnetic field declination especially in polar regions (for supported devices only with magnetic sensor/E-Compass)

### Features
- Display Islamic Calendar, Moon Information, Prayer Times, Prayer Schedule List, Qibla Direction, Moon Crescent Visibility map, and Eclipses (Solar and Lunar Eclipses)
- App Configuration (Input Desired Date and Time, Automatic Current Location, Search Cities, Set Latitude, Longitude, and Elevation manually, Select Calendar Criteria Estimation, Timezone Selection, and Refresh Update Time)
- Prayer Times Configuration (Calculation Method Selection, Asr Time/<i>Mazhab</i>, Convention, <i>Zawal</i> Start Time after <i>Istiwa'</i>, <i>Ihtiyath</i>, Prayer Times Precision, Dhuha Calculation Method, and Prayer Times Correction)
- Moon Crescent Map (Hijri Month Selection, Moon Crescent Visibilities Criteria, Geocentric and Topocentric Options of Moon Elongation & Moon Altitude, Plot Marker Sampling)
- Download and Print Prayer Times Schedule in a month (in Gregorian or Hijri Date).

<strong><i>Disclaimer</i> :</strong> This web app is still far from perfect and still needs a lot of improvements.

### Tech Stack
- React.js with Vite build tool
- Tailwind CSS
- Headless UI
- Animate.css
- i18next
- tzdb
- React to Print
- React Helmet
- React Slick Carousel
- Astronomy Engine
- React Router
- SweetAlert2
- Vite Plugin PWA
