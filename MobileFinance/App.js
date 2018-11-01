import React, { Component } from 'react';
import { Alert, Platform, Button, Text, StyleSheet, View, TextInput } from 'react-native';
import axios from 'axios';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

const url = 'http:///7bc7b43c.ngrok.io';

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      username: '',
      email: '',
      password: '',
      loggedIn: true,

      spent: 0,
      remaining: 0,

      moneyIn: 0,
      amount: 0,
      desc: '',
      dayOfWeek: '',
    }
    this.Login = this.Login.bind(this);
    this.Main = this.Main.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }

  submitLogin() {
    axios.post(url + '/api/auth/login', {
      email: this.state.email,
      password: this.state.password
    })
      .then((response) => function () {
        this.setState({
          loggedIn: true,
          username: response.data.data.user.username,
          password: ''
        })
      })
      .catch((error) => function () {
        console.log(error.response);
      });
    // this.forceUpdate();
  }

  _btnPressed(e, btn) {
    axios.post(url + '/api/auth/logout')
      .then((response) => function () {
        this.setState({
          loggedIn: false
        })
      })
      .catch((error) => function () {
        console.log(error.response);
      });
    // this.forceUpdate();
  }

  Login() {
    return (
      <View style={styles.loginContainer}>
        <Button onPress={(event) => this._btnPressed(event, 'logout')} title="Log Out" />
        <TextInput style={{ fontSize: 24 }}
          clearTextOnFocus={true}
          placeholder="email"
          onChangeText={(email) => this.setState({ email })}
          onSubmitEditing={() => { this.secondTextInput.focus(); }}
          blurOnSubmit={false}
        />
        <TextInput style={{ fontSize: 24 }}
          clearTextOnFocus={true}
          secureTextEntry={true}
          placeholder="password"
          ref={(input) => { this.secondTextInput = input; }}
          onChangeText={(password) => this.setState({ password })}
          onSubmitEditing={this.submitLogin}
        />
      </View>
    );
  }

  componentDidMount() {
    axios.get(url + '/api/finance/current')
      .then((response) => {
        this.setState({
          spent: response.data.data.period.spent,
          remaining: response.data.data.period.remaining
        })
      })
      .catch((error) => {
        console.log(error.response)
      })
  }

  Main() {
    var radio_props = [
      { label: 'Money Out   ', value: 0 },
      { label: 'Money In', value: 1 }
    ];
    return (
      <View style={styles.mainContainer}>
        <Button style={styles.topRight} onPress={(event) => this._btnPressed(event, 'logout')} title="Log Out" />
        <Text style={styles.header}>Welcome, {this.state.username}!</Text>
        <View style={styles.moneyValues}>
          <View style={styles.moneyContainer}>
            <Text style={{ fontSize: 30, color: 'red' }}>${this.state.spent}</Text>
          </View>
          <View style={styles.moneyContainer}>
            <Text style={{ fontSize: 30, color: 'green' }}>${this.state.remaining}</Text>
          </View>
        </View>
        <Text style={styles.header}>Log Transaction</Text>
        <View>
          <View style={styles.radioContainer}>
            <RadioForm
              radio_props={radio_props}
              initial={0}
              formHorizontal={true}
              animation={true}
              onPress={(moneyIn) => { this.setState({ moneyIn: moneyIn }) }}
            />
          </View>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View>
        {this.state.loggedIn ? <this.Main /> : <this.Login />}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  loginContainer: {
    width: '90%',
    alignSelf: "center",
    marginTop: '25%'
  },
  mainContainer: {
    width: '90%',
    alignSelf: "center",
    marginTop: 10,
    fontSize: 20
  },
  topRight: {

  },
  header: {
    fontSize: 36,
    textAlign: "center",
    margin: 15
  },
  moneyValues: {
    flexDirection: "row",
    justifyContent: "center",
    margin: '10%'
  },
  moneyContainer: {
    width: '50%',
    alignItems: "center",
    fontSize: 30,
  },
  radioContainer: {
    alignSelf: "center",

  }
});
