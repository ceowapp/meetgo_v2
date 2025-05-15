import { InterstitialAd } from 'react-native-google-mobile-ads';
import AdsManager from 'manager/adsManager';

class InterstitialAdsService {
 constructor() {
   this.ad = null;
   this.isLoaded = false;
   this.loadCallback = null;
   this.closeCallback = null;
 }

 load() {
   if (this.ad) {
     this.unsubscribeEvents();
   }
   
   this.ad = InterstitialAd.createForAdRequest(AdsManager.getInterstitialAdUnitId());
   
   this.loadedListener = this.ad.addAdEventListener('loaded', () => {
     this.isLoaded = true;
     if (this.loadCallback) this.loadCallback();
   });
   
   this.closedListener = this.ad.addAdEventListener('closed', () => {
     this.isLoaded = false;
     if (this.closeCallback) this.closeCallback();
     this.load();
   });
   
   this.errorListener = this.ad.addAdEventListener('error', (error) => {
     console.error('Interstitial ad error:', error);
     this.isLoaded = false;
   });
   
   this.ad.load();
   return this;
 }
 
 unsubscribeEvents() {
   if (this.loadedListener) this.loadedListener();
   if (this.closedListener) this.closedListener();
   if (this.errorListener) this.errorListener();
 }

 show() {
   if (this.isLoaded && this.ad) {
     this.ad.show();
     return true;
   }
   return false;
 }

 onLoad(callback) {
   this.loadCallback = callback;
   return this;
 }

 onClose(callback) {
   this.closeCallback = callback;
   return this;
 }
}

export default new InterstitialAdsService();