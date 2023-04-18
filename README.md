# World Travel Level Web App

This web app renders an interactive map that users can play around in order to know how well their world travelling progress look like. You can select a country on the map and choose your travel status on that country.

## Different Travel Status

Each travel status for a country has its corresponding level that adds up to your **world level** shown on the top-right portion of the app. The **world level** is a great way to show others how much you've travelled around the world!

| Travel Status    | Level |
|      :---:       | :---: |
| Lived There      | 5     |
| Stayed There     | 4     |
| Visited There    | 3     |
| Alighted There   | 2     |
| Passed There     | 1     |
| Never Been There | 0     |

## How to share my map?

You can share your map by saving it as an image. The `Save Map as Image` button takes a **screenshot** of your map as a `.png` image so make sure to zoom out and align your map properly before clicking the button.

**For mobile devices:** set your phone's browser to landscape mode to get a better image for your map.

## Technical stuff

This web app was made possible by **React** and a few libraries like **Leaflet** for the map and [**dom-to-image**](https://github.com/tsayen/dom-to-image) for the image saving feature.

The app also uses a `.geojson` file provided by [geojson-regions](https://github.com/AshKyd/geojson-regions).

This project was inspired by [philippine-map-app](https://github.com/OSSPhilippines/philippine-map-app) so feel free to support their project as well!

**Happy travels!**
