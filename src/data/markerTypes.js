// MarkerTypes.js - Create this file to store your marker definitions
import { getAssetPath } from '../utils/assetUtils';

export const markerTypes = {
    default: {
      id: 'default',
      name: 'Animated Circle',
      type: 'animated',
    },
    circle1: {
      id: 'circle1',
      name: 'Circle 1',
      path: getAssetPath('assets/icons/infoCircle/circle1.svg'),
      type: 'image'
    },
    circle2: {
      id: 'circle2',
      name: 'Circle 2',
      path: getAssetPath('assets/icons/infoCircle/circle2.svg'),
      type: 'image'
    },
    info1: {
      id: 'info1',
      name: 'Info 1',
      path: getAssetPath('assets/icons/infoCircle/info1.svg'),
      type: 'image'
    },
    info2: {
      id: 'info2',
      name: 'Info 2',
      path: getAssetPath('assets/icons/infoCircle/info2.svg'),
      type: 'image'
    },
    star1: {
      id: 'star1',
      name: 'Star 1',
      path: getAssetPath('assets/icons/infoCircle/star1.svg'),
      type: 'image'
    },
    star2: {
      id: 'star2',
      name: 'Star 2',
      path: getAssetPath('assets/icons/infoCircle/star2.svg'),
      type: 'image'
    },
    star3: {
      id: 'star3',
      name: 'Star 3',
      path: getAssetPath('assets/icons/infoCircle/star3.svg'),
      type: 'image'
    },
    star4: {
      id: 'star4',
      name: 'Star 4',
      path: getAssetPath('assets/icons/infoCircle/star4.svg'),
      type: 'image'
    },
  };