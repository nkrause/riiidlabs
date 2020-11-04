import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
} from 'react-native';

// third party imports
import {Cache} from 'aws-amplify';
import {SearchBar} from 'react-native-elements';

// custom imports
import {checkRateLimit, searchUsers, fetchUser} from './src/api/github_api.js';
import {string} from './src/constants/global_strings.js';
import {scale, verticalScale} from './src/utils/helper_functions.js';
import GithubUser from './src/components/github_user.js';

class App extends React.Component {
  state = {
    search: '',
    userData: [],
    noUsersFound: false,
  };

  /**
   * Handles when the user types in the SearchBar
   *
   * @param {string} text
   */
  onChangeText = (text) => {
    clearTimeout(this.typingTimer);

    this.setState({
      search: text,
    });

    // wait a second until after typing to call the Github API
    this.typingTimer = setTimeout(() => {
      // only call API if search text is greater than 2 characters
      if (text.length >= 3) {
        this.performSearch(text);
      }
    }, 1000);
  };

  /**
   * Handle when the user clicks the 'X' button in the search bar
   *
   * @param {string} text
   */
  onClear = (text) => {
    if (text !== undefined) {
      this.onChangeText(text);
    } else {
      this.setState({userData: []});
    }
  };

  /**
   * Peform a search asynchronously after the threshold period of when a user stops typing.
   * Pull the search either from the Cache or call the Github API
   *
   * @param {string} searchText
   */
  performSearch = async (searchText) => {
    // retrieve the search from the cache
    const cachedSearch = await Cache.getItem(searchText);

    //cache hit
    if (cachedSearch !== null) {
      // set the state to the cached search
      this.setState({
        userData: JSON.parse(cachedSearch),
      });
    }
    // cache miss - call the Github API
    else {
      // check the rate limit
      const rateLimit = await checkRateLimit();
      if (rateLimit.remaining === 0) {
        return;
      }

      try {
        // perform the user search by username
        const searchData = await searchUsers(searchText);

        // if the search returns no result, show a message
        if (searchData.items.length === 0) {
          this.setState({noUsersFound: true});
        } else {
          this.setState({noUsersFound: false});
        }

        // get all the individual user objects to get the number of repos per user
        Promise.all(searchData.items.map((item) => fetchUser(item.login))).then(
          (res) => {
            // store the search in the cache
            Cache.setItem(searchText, JSON.stringify(res));

            // set the state to the result of the Github API call
            this.setState({userData: res});
          },
        );
      } catch (err) {}
    }
  };

  /**
   * keyExtractor
   * @param {object} item
   * @param {number} index
   * @return {string}
   */
  keyExtractor = (item, index) => {
    return item.login;
  };

  /**
   * renderItem
   * @param {object} item
   * @param {number} index
   * @return {View}
   */
  renderItem = ({item, index}) => {
    // happens when there are more users to fetch in the list than the number of API calls left
    if (item.message && item.message.includes(string.API_RATE_LIMIT_EXCEEDED)) {
      return undefined;
    }

    return <GithubUser user={item} />;
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <Text style={styles.header}>{string.GITHUB_REPOS}</Text>
          <SearchBar
            containerStyle={styles.searchBarContainerStyle}
            inputContainerStyle={styles.searchBarInputContainerStyle}
            placeholder={string.SEARCH_BAR_PLACEHOLDER}
            onChangeText={this.onChangeText}
            onClear={this.onClear}
            value={this.state.search}
          />
          <FlatList
            data={this.state.userData}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            showsVerticalScrollIndicator={false}
          />
          {this.state.noUsersFound && (
            <Text style={styles.noUsersFoundText}>
              {string.NO_USERS_FOUNDcomp}
            </Text>
          )}
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    textAlign: 'center',
    fontSize: scale(24),
    fontWeight: 'bold',
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(8),
  },
  searchBarContainerStyle: {
    backgroundColor: '#bdbdc2',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  searchBarInputContainerStyle: {
    backgroundColor: '#fff',
    marginTop: verticalScale(4),
    marginBottom: verticalScale(4),
  },
  noUsersFoundText: {
    fontSize: scale(14),
    marginTop: verticalScale(12),
    textAlign: 'center',
  },
});

export default App;
