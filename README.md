# RiiidLabs Take-Home Assessment

Install Instructions:
- Download .zip file and unzip
- In Terminal, navigate to project root directory and type 'npm install'
- Android: 
  - Type 'npx react-native run-android'
- iOS:
  - Type 'cd ios && pod install && cd ..' then 'npx react-native run-ios'

API Flow:
- User types in 3 or more characters (to save API calls and limit results), the app waits 1 second then automatically calls the API
  - If the user has performed this search before, the results will be pulled from the Cache, otherwise it will call the API
  - If the user is near or over the rate limit, an Alert will be displayed and the app won't call the API. However, cached searching is still available.
- The initial API calls the '/search/users?q=${searchText}+in:login' endpoint to return the list of users that matches the search
  - Note: I changed the search to only include the username to limit the API calls even though the example shows otherwise
- The results from the first API call are used to fetch the individual user object from the '/users/${login}' endpoint in order to obtain the number of repos

Things to add:
- Cache individual user objects, not just the search (this didn't seem necessary for the purpose of this assignment)
- Add auth to increase rate limit
- Add activity indicator while fetching from API
  - Although the results seemed to populate fairly quickly so this didn't seem necessary as the indicator would briefly flash
 
