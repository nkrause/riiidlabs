import {Alert} from 'react-native';
import moment from 'moment';

/**
 * Check the number of Github API calls remaining
 *
 * Note: There are really only 10 searches but 60 total API calls per hour
 * Since each search uses multiple API calls (for each individual user's num of repos)
 * we will likely max out the 60 total API calls before 10 searches
 */
const checkRateLimit = async () => {
  const result = await fetch('https://api.github.com/rate_limit');
  const response = await result.json();

  const rateLimit = response.rate;

  // get the time (in {x} minutes) when the API rate limit will reset
  const fromNow = moment.unix(rateLimit.reset).fromNow();

  // display an Alert if there are no API calls left and return
  if (rateLimit.remaining === 0) {
    Alert.alert(`API rate limit exceeded. Please try again ${fromNow}.`);
  }
  // display an Alert if there are only 10 searches left
  else if (rateLimit.remaining < 10) {
    Alert.alert(
      `You have less than 10 API calls remaining. The limit will reset ${fromNow}.`,
    );
  }
  return rateLimit;
};

/**
 * Search Github users by username - this will not return the number of repos the user has
 *
 * @param {string} searchText
 */
const searchUsers = async (searchText) => {
  const result = await fetch(
    `https://api.github.com/search/users?q=${searchText}+in:login`,
  );
  const response = await result.json();
  return response;
};

/**
 * Retrieve more detailed info about a specific user (i.e. number of repos)
 *
 * @param {string} login The Github login/username
 */
const fetchUser = async (login) => {
  const result = await fetch(`https://api.github.com/users/${login}`);
  const response = await result.json();
  return response;
};

export {checkRateLimit, searchUsers, fetchUser};
