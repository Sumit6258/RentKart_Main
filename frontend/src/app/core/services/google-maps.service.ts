import { Injectable } from '@angular/core';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private loaded = false;

  constructor() {}

  isLoaded(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof google !== 'undefined' && google.maps) {
        this.loaded = true;
        resolve(true);
      } else {
        const checkInterval = setInterval(() => {
          if (typeof google !== 'undefined' && google.maps) {
            this.loaded = true;
            clearInterval(checkInterval);
            resolve(true);
          }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve(false);
        }, 10000);
      }
    });
  }

  async initAutocomplete(inputElement: HTMLInputElement, callback: (place: any) => void) {
    const isLoaded = await this.isLoaded();
    if (!isLoaded) {
      console.error('Google Maps API failed to load');
      return;
    }

    const autocomplete = new google.maps.places.Autocomplete(inputElement, {
      types: ['address'],
      componentRestrictions: { country: 'in' }
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        callback(place);
      }
    });
  }

  async createMap(element: HTMLElement, lat: number, lng: number): Promise<any> {
    const isLoaded = await this.isLoaded();
    if (!isLoaded) {
      console.error('Google Maps API failed to load');
      return null;
    }

    const map = new google.maps.Map(element, {
      center: { lat, lng },
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: map,
      draggable: true
    });

    return { map, marker, google };
  }
}
