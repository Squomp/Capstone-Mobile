import React, { Component } from 'react';
import {
  Alert, Platform, Picker, Button,
  Text, StyleSheet, View, TextInput,
} from 'react-native';
import axios from 'axios';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

const url = 'http://75f525a9.ngrok.io';

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      username: '',
      email: '',
      password: '',
      loggedIn: false,

      spent: 0,
      remaining: 0,
      startDate: moment(),
      endDate: moment(),

      moneyIn: 0,
      amount: 0,
      desc: '',
      dayOfWeek: 'monday',
      date: moment().format('YYYY-MM-DD')
    }
    this.Login = this.Login.bind(this);
    this.Main = this.Main.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
    this._logout = this._logout.bind(this);
    this._submitTransaction = this._submitTransaction.bind(this);
  }

  submitLogin() {
    axios.post(url + '/api/auth/login', {
      email: this.state.email,
      password: this.state.password
    })
      .then((response) => {
        this.setState({
          loggedIn: true,
          username: response.data.data.user.username,
          password: '',
        })
        this.getPeriodData();
      })
      .catch((error) => {
        this.showAlert('Failed to login')
      });
  }

  _logout() {
    axios.post(url + '/api/auth/logout')
      .then((response) => {
        this.setState({
          loggedIn: false,
          username: ''
        })
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  Login() {
    return (
      <View style={styles.loginContainer}>
        <Text style={{ fontSize: 34, textAlign: 'center', marginBottom: '2%' }}>Log In</Text>
        {/* <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Button onPress={this._logout} title="Log Out" />
        </View> */}
        <TextInput style={{ fontSize: 24 }}
          clearTextOnFocus={true}
          placeholder="email"
          autoCapitalize="none"
          onChangeText={(email) => this.setState({ email })}
          onSubmitEditing={() => { this.secondTextInput.focus(); }}
          blurOnSubmit={false}
        />
        <TextInput style={{ fontSize: 24 }}
          clearTextOnFocus={true}
          secureTextEntry={true}
          placeholder="password"
          autoCapitalize="none"
          ref={(input) => { this.secondTextInput = input; }}
          onChangeText={(password) => this.setState({ password })}
          onSubmitEditing={this.submitLogin}
        />
        {/* <Text style={{ textAlign: "center", color: 'red' }}>{this.state.loginMsg}</Text> */}
      </View>
    );
  }

  componentDidMount() {
    axios.get(url + '/api/user')
      .then((response) => {
        if (response.data.success) {
          this.setState({
            loggedIn: true,
            username: response.data.data.user.username
          })
          this.getPeriodData();
        } else {
          this.setState({ loggedIn: false })
        }
      })
      .catch((error) => {
        console.log(error.response)
      })
  }

  getPeriodData() {
    axios.get(url + '/api/finance/current')
      .then((response) => {
        this.setState({
          spent: response.data.data.period.spent,
          remaining: response.data.data.period.remaining,
          startDate: response.data.data.period.start_date,
          endDate: response.data.data.period.end_date,
        })
      })
      .catch((error) => {
        console.log(error.response)
      })
  }

  _submitTransaction() {
    this.showAlert(this.state.date);
    axios.post(url + '/api/finance/log', {
      amount: this.state.amount,
      description: this.state.desc,
      dayOfWeek: this.state.dayOfWeek,
      date: this.state.date,
      isIncome: this.state.moneyIn
    })
      .then((response) => {
        this.showAlert('Transaction submitted');
        this.getPeriodData();
        this.amountInput.clear();
        this.descInput.clear();
      })
      .catch((error) => {
        this.showAlert('Failed to submit transaction')
      })
  }

  Main() {
    var radio_props = [
      { label: 'Money Out   ', value: 'false' },
      { label: 'Money In', value: 'true' }
    ];
    const today = moment('2018-12-05').format('MM/DD');
    const start = moment(this.state.startDate).format('MM/DD');
    const end = moment(this.state.endDate).format('MM/DD');
    return (
      <View style={styles.mainContainer}>      
      {/* <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
        scrollEnabled={false}
      > */}
        <View style={{ width: 100, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Button onPress={this._logout} title="Log Out" />
        </View>
        <Text style={styles.header}>Welcome, {this.state.username}!</Text>
        <Text style={styles.secondaryHeader}>{start} - {end}</Text>
        <Text style={styles.secondaryHeader}>{today}</Text>
        <View style={styles.moneyValues}>
          <View style={styles.moneyContainer}>
            <Text >Spent</Text>
            <Text style={{ fontSize: 30, color: 'red' }}>${this.state.spent}</Text>
          </View>
          <View style={styles.moneyContainer}>
            <Text>Remaining</Text>
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
          <View style={styles.transactionValueContainer}>
            <TextInput
              ref={input => { this.amountInput = input }}
              placeholder="amount"
              keyboardType='number-pad'
              onChangeText={(amount) => this.setState({ amount })}
            />
            <TextInput placeholder="description"
              ref={input => { this.descInput = input }}
              onChangeText={(desc) => this.setState({ desc })}
            />
            <DatePicker
              style={{ width: 200 }}
              date={moment('2018-12-05')}
              mode="date"
              placeholder="select date"
              format="YYYY-MM-DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                }
              }}
              onDateChange={(date) => { this.setState({ date: date }) }}
            />
            <View style={{ height: 20 }} />
            <Button onPress={this._submitTransaction} title="Save Transaction" />
          </View>
        </View>
      {/* </KeyboardAwareScrollView> */}
      </View>
    )
  }

  showAlert = (msg) => {
    Alert.alert(
      msg
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
    marginTop: '5%',
  },
  header: {
    fontSize: 36,
    textAlign: "center",
    margin: '5%'
  },
  secondaryHeader: {
    fontSize: 28,
    textAlign: "center",
    margin: '3%'
  },
  moneyValues: {
    flexDirection: "row",
    justifyContent: "center",
  },
  moneyContainer: {
    width: '50%',
    alignItems: "center",
    fontSize: 30,
  },
  radioContainer: {
    alignSelf: "center",
    margin: '5%'
  },
  transactionValueContainer: {
    width: '70%',
    alignSelf: 'center'
  },
});
