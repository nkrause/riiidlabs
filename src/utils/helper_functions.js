import {Dimensions} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const guidelineBaseWidth = 414;
const guidelineBaseHeight = 896;

// https://github.com/nirsky/react-native-scaling-example
/**
 * Scale a space horizontally for different screen sizes
 * @param {number} size The size to scale
 * @return {number} The scaled size based on the width
 */
const scale = (size) => {
  const newSize = Math.round((screenWidth / guidelineBaseWidth) * size);
  return newSize;
};

/**
 * Scale a space vertically for different screen sizes
 * @param {number} size The size to scale
 * @return {number} The scaled size based on the height
 */
const verticalScale = (size) => {
  const newSize = Math.round((screenHeight / guidelineBaseHeight) * size);
  return newSize;
};

export {scale, verticalScale};
