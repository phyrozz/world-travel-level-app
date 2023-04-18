import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './WorldMap.css';
import domtoimage from 'dom-to-image';


class WorldMap extends React.Component {
  map = null;

  constructor(props) {
    super(props);
    this.state = {
      levelCounter: 0
    }
    this.levelCounterRef = React.createRef();
    this.mapContainerRef = React.createRef();

  }

  updateLevelCounter = (prevStatus, newStatus) => {
    let levelsToRemove = 0;
    let levelsToAdd = 0;
    switch (prevStatus) {
      case 'lived':
        levelsToRemove = 5;
        break;
      case 'stayed':
        levelsToRemove = 4;
        break;
      case 'visited':
        levelsToRemove = 3;
        break;
      case 'alighted':
        levelsToRemove = 2;
        break;
      case 'passed':
        levelsToRemove = 1;
        break;
      default:
        levelsToRemove = 0;
    }
    switch (newStatus) {
      case 'lived':
        levelsToAdd = 5;
        break;
      case 'stayed':
        levelsToAdd = 4;
        break;
      case 'visited':
        levelsToAdd = 3;
        break;
      case 'alighted':
        levelsToAdd = 2;
        break;
      case 'passed':
        levelsToAdd = 1;
        break;
      default:
        levelsToAdd = 0;
    }
    this.setState(prevState => ({
      levelCounter: prevState.levelCounter - levelsToRemove + levelsToAdd
    }), () => {
      this.levelCounterRef.current.innerText = this.state.levelCounter;
    });
  }  

  componentDidMount() {
    if (!this.map) {
      this.map = L.map('map', {
        zoomControl: false,
        zoomSnap: false,
        wheelPxPerZoomLevel: 300,
      }).setView([0, 0], 2);
    }

    fetch(process.env.PUBLIC_URL + '/countries.geo.json')
      .then(res => res.json())
      .then(data => {
        L.geoJSON(data, {
          style: feature => {
            const visited = feature.properties.visited;
            let color = visited === 'lived' ? '#E21818' : (visited === 'stayed' ? '#FF7F3F' : (visited === 'visited' ? '#FFDD83' : (visited === 'alighted' ? '#98DFD6' : (visited === 'passed' ? '#00235B' : '#fff'))));
            return {
              color: 'black',
              fillColor: color,
              weight: 1,
            };
          },
          onEachFeature: (feature, layer) => {
            const options = [
              {value: 'not-visited', label: 'Never been there'},
              {value: 'visited', label: 'Visited there'},
              {value: 'stayed', label: 'Stayed there'},
              {value: 'lived', label: 'Lived there'},
              {value: 'alighted', label: 'Alighted there'},
              {value: 'passed', label: 'Passed there'},
            ];
            const buttons = options.map(({value, label}) => {
              const button = document.createElement('button');
              button.innerText = label;
              button.className = `button-${value}`;
              button.addEventListener('click', () => {
                const prevStatus = feature.properties.visited;
                feature.properties.visited = value === 'not-visited' ? null : value;
                layer.setStyle({
                  fillColor: value === 'not-visited' ? '#fff' : (value === 'lived' ? '#E21818' : (value === 'stayed' ? '#FF7F3F' : (value === 'visited' ? '#FFDD83' : (value === 'alighted' ? '#98DFD6' : (value === 'passed' ? '#00235B' : '#fff')))))
                });
                this.updateLevelCounter(prevStatus, feature.properties.visited);              
              });              
              return button;
            });
            const popupContent = document.createElement('div');
            const label = document.createElement('h3');
            label.innerText = feature.properties.admin;
            popupContent.appendChild(label);
            const buttonWrapper = document.createElement('div');
            buttonWrapper.className = 'button-wrapper';
            buttons.forEach(button => {
              buttonWrapper.appendChild(button);
            });
            popupContent.appendChild(buttonWrapper);
            layer.bindPopup(popupContent);
            layer.bindTooltip(feature.properties.admin, {sticky: true}).openTooltip();
          },
        }).addTo(this.map)
      });
  }

  render() {
    return <div>
      <button id='save-image' onClick={this.saveMapImage}>Save Map as Image</button>
      <form id='donation-btn' action="https://www.paypal.com/donate" method="post" target="_top">
        <input type="hidden" name="hosted_button_id" value="WZ9GT9C5JPQE4" />
        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
        <img alt="" border="0" src="https://www.paypal.com/en_PH/i/scr/pixel.gif" width="1" height="1" />
      </form>
      <div id='map' className='worldmap' ref={this.mapContainerRef}>
        <div className='level-container' ref={this.legendContainerRef}>
          <h1><strong>World Level </strong><span ref={this.levelCounterRef}>{this.state.levelCounter}</span></h1>
          <div className='legend'>
            <div className='left'>
              <div><span style={{backgroundColor: "#E21818"}}></span> Lived there</div>
              <div><span style={{backgroundColor: "#FF7F3F"}}></span> Stayed there</div>
              <div><span style={{backgroundColor: "#FFDD83"}}></span> Visited there</div>
              <div><span style={{backgroundColor: "#98DFD6"}}></span> Alighted there</div>
              <div><span style={{backgroundColor: "#00235D"}}></span> Passed there</div>
              <div><span style={{backgroundColor: "#fff"}}></span> Never been there</div>
            </div>
            <div className='right'>
            <div>Level: 5</div>
              <div>Level: 4</div>
              <div>Level: 3</div>
              <div>Level: 2</div>
              <div>Level: 1</div>
              <div>Level: 0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  }

  saveMapImage = () => {
    const mapContainer = this.mapContainerRef.current;
    const saveButton = document.getElementById('save-image');
    saveButton.disabled = true;
    
    const cropWidth = mapContainer.offsetWidth;
    const cropHeight = mapContainer.offsetHeight;
    
    const options = {
      width: cropWidth,
      height: cropHeight,
      filter: (node) => node.id !== 'save-image'
    };
    
    domtoimage.toPng(mapContainer, options)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'map.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error('Error while saving map as image:', error);
      });
    saveButton.disabled = false;
  }
  
}

export default WorldMap;
