/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import * as React from 'react';
import { Platform, Linking, StyleSheet } from 'react-native';
import { Appbar, DefaultTheme, Button, Paragraph, Dialog, FAB, Portal, List, TextInput, Provider as PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#800000',
    accent: '#89cff0',
  }
};

export default class App extends React.Component {
  state = {
    expanded: true,
    success: false,
    error: false,
    place: 'Texas Road House',
    options: [],
    currentOption: 0,
    total: 0,

    // yelp options
    radius: 5,
    location: 0,
    openNow: true,
    keyword: '',
    price: '$'
  }

  _handlePress = () =>
    this.setState({
      expanded: !this.state.expanded
    });

  _hideSuccessDialog = () => this.setState({ success: false });
  _hideErrorDialog = () => this.setState({ error: false });

  _buildUrl() {
    var base = 'https://api.yelp.com/v3/businesses/search?';
    var keyword = 'term=' + this.state.keyword;
    var location = '&location=' + this.state.location;
    var price = '&price=' + this.state.price.length;
    var radius = '&radius' + (this.state.radius * 1609);

    return base + keyword + location + price + radius + '&open_now=true';
  }

  _getPlaces() {
    try {
      return fetch(this._buildUrl(), {
        method: 'GET',
        headers: {
          Authorization: 'Bearer E8rrnk3-XAkIoSiDU4LvFgBk2sFj84tCI_IkstU9gCdRjXV8taS5l97-Vh_QTCRiLfJFEniZLkN92rZkvAD6TVeoh5RCsWjxLiZMzZoF-GhvkquEm8ql06TIcfLZXHYx',
        }
      })
      .then((response) => response.json())
      .then((yelpAPI) => {
        if (yelpAPI.total > 0) {
          var randomNum = Math.floor(Math.random() * yelpAPI.total);
          this.setState({
            options: yelpAPI.businesses,
            place: yelpAPI.businesses[randomNum].name,
            success: true,
            currentOption: randomNum,
            total: yelpAPI.total
          });
        } else {
          this.setState({
            options: [],
            place: 'You are to damn picky!',
            success: true,
            currentOption: 0,
            total: 0
          });
        }
      });
    } catch (error) {
      this.setState({
        options: [],
        place: 'An error has occured!',
        error: true,
        currentOption: 0,
        total: 0
      });
    }
  }

  _newPlace() {
    if (this.state.total > 0) {
      var randomNum = Math.floor(Math.random() * this.state.total);
      this.setState({
        place: this.state.options[randomNum].name,
        currentOption: randomNum
      });
    }
  }

  _directions() {
    const lat = this.state.options[this.state.currentOption].coordinates.latitude;
    const lng = this.state.options[this.state.currentOption].coordinates.longitude;
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lng}`;
    const label = this.state.options[this.state.currentOption].name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });


    Linking.openURL(url);
  }

  render() {
    return (
      <PaperProvider theme={theme}>
        <Appbar.Header>
          <Appbar.Content
            title="Where To Eat"
          />
        </Appbar.Header>
        

        <TextInput
          label='Keyword(s)'
          value={this.state.keyword}
          onChangeText={keyword => this.setState({ keyword })}
        />

        <TextInput
          label='Zipcode'
          value={this.state.location}
          onChangeText={location => this.setState({ location })}
        />

        <List.Section >
          <List.Accordion
            title={"Radius | " + this.state.radius + " Miles"}
            left={props => <List.Icon {...props} icon="wifi" />}
          >
            <List.Item 
              title="5 Miles"
              onPress={() => { this.setState({ radius: 5}) }}
            />
            <List.Item 
              title="10 Miles"
              onPress={() => { this.setState({ radius: 10}) }}
            />
            <List.Item 
              title="15 Miles"
              onPress={() => { this.setState({ radius: 15}) }}
            />
            <List.Item 
              title="20 Miles"
              onPress={() => { this.setState({ radius: 20}) }}
            />
            <List.Item 
              title="25 Miles"
              onPress={() => { this.setState({ radius: 25}) }}
            />
          </List.Accordion>

          <List.Accordion
            title={"Price | " + this.state.price}
            left={props => <List.Icon {...props} icon="monetization-on" />}
          >
          <List.Item 
            title="$"
            onPress={() => { this.setState({ price: '$'}) }}
          />
          <List.Item 
            title="$$"
            onPress={() => { this.setState({ price: '$$'}) }}
          />
          <List.Item 
            title="$$$"
            onPress={() => { this.setState({ price: '$$$'}) }}
          />
          <List.Item 
            title="$$$$"
            onPress={() => { this.setState({ price: '$$$$'}) }}
          />
          </List.Accordion>
        </List.Section>

        <Portal>
          <FAB
            style={styles.fab}
            icon={'play-arrow'}
            onStateChange={({ open }) => this.setState({ open })}
            onPress={() => {
              this._getPlaces()
            }}
          />
      </Portal>
      <Portal>
        <Dialog
          visible={this.state.success}
          onDismiss={this._hideSuccessDialog}>
            <Dialog.Title>You Should eat here!</Dialog.Title>
            <Dialog.Content>
              
              <Paragraph>{this.state.place}</Paragraph>
              <Dialog.Actions>
                <Button onPress={() => this._newPlace()}>Refresh</Button>
                <Button onPress={() => this._directions()}>Directions</Button>
              </Dialog.Actions>
            </Dialog.Content>
            
        </Dialog>
        <Dialog
          visible={this.state.error}
          onDismiss={this._hideErrorDialog}>
            <Dialog.Title>Error</Dialog.Title>
            <Dialog.Content>
              
              <Paragraph>{this.state.place}</Paragraph>
              <Dialog.Actions>
                <Button onPress={() => this._hideErrorDialog()}>Dismiss</Button>
              </Dialog.Actions>
            </Dialog.Content>
            
        </Dialog>
      </Portal>
      </PaperProvider>
    );
  }
}


const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})