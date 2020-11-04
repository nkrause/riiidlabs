import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

// third party imports
import {Divider} from 'react-native-elements';

// custom imports
import {string} from '../constants/global_strings.js';
import {scale, verticalScale} from '../utils/helper_functions.js';

/**
 * Github User - A component representing an object to display in the list of search results
 */
export default class GithubUser extends React.PureComponent {
  /**
   * render
   * @return {View}
   */
  render() {
    const user = this.props.user;
    return (
      <>
        <View style={styles.item}>
          <View style={styles.itemLeftContainer}>
            <Image source={{uri: user.avatar_url}} style={styles.avatar} />
          </View>

          <View style={styles.itemRightContainer}>
            <Text style={styles.usernameText}>{user.login}</Text>
            <Text
              style={
                styles.numReposText
              }>{`${string.NUMBER_OF_REPOS} ${user.public_repos}`}</Text>
          </View>
        </View>
        <Divider style={styles.divider} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(12),
    color: 'white',
  },
  itemLeftContainer: {
    flex: 0.2,
    borderWidth: 0,
  },
  itemRightContainer: {
    flex: 0.8,
    borderWidth: 0,
  },
  usernameText: {
    fontSize: scale(20),
  },
  numReposText: {
    fontSize: scale(14),
    opacity: 0.4,
    marginTop: verticalScale(6),
  },
  avatar: {
    height: scale(65),
    width: scale(65),
  },
  divider: {
    height: 1,
    marginLeft: scale(12),
    marginRight: scale(12),
  },
});
