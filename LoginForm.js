import React, { Component } from 'react'
import {WebView, Text, TouchableOpacity, View, StatusBar, Linking, Platform} from 'react-native'

import { connect } from 'react-redux'
import { emailChanged, passwordChanged, loginUser } from '../../redux/actions'
import { LoginButtons, Heroimage, Card, CardSection, Input, Button, Spinner } from '../../components'
import Images from '@assets/images'
import SafariView from "react-native-safari-view";

// i've used reusable component for Heroimage, LoginButtons, CardSection

class LoginForm extends Component {
  state = {
    email    : '',
    password : '',
    authenticated :  false,
  };

  onLoginPressed() {
    // getting data from state
    const { email, password } = this.state;

    // called action method for check login ?
    this.props.loginUser({ email, password });
    this.setState ({LoggedIn: true,});
  }

  render() {
    console.disableYellowBox = true;
    return (
      <View style={styles.container}>
        <Heroimage
          image={Images.cow}
          smalltitle='Welcome to the'
          title='The Meat Traders App'
          smalltitle2='From Meatex'
        />

        <CardSection>
          <LoginButtons/>
        </CardSection>

        <CardSection>
          <Input
            label="Email"
            placeholder="Email Address"
            onChangeText={email => this.setState({email})}
            value={this.state.email}
            image={Images.letter}
          />
        </CardSection>

        <CardSection>
          <Input
            secureTextEntry
            label="Password"
            placeholder="Password"
            onChangeText={password => this.setState({password})}
            value={this.state.password}
            image={Images.lock}
          />
        </CardSection>

        <CardSection>
          <Button
            loading={this.props.loading}
            buttonStyle={styles.loginBtn}
            title='Login'
            onPress={() => this.onLoginPressed()}
          />
        </CardSection>

        <TouchableOpacity activeOpacity={0.7}
                          onPress={
                            () => Platform.OS === 'ios' ?
                              SafariView.isAvailable()
                                .then(SafariView.show({
                                  url: "https://meatex.co.uk/my-account-2/lost-password/"
                                }))
                                .catch(error => {
                                  alert(error)
                                })
                              :
                              Linking.openURL('https://meatex.co.uk/my-account-2/lost-password/')}
        >
          <Text style={styles.forgotPass}>
            Forgot Your Password?
          </Text>
        </TouchableOpacity>
      </View>

    )
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  loginBtn: {
    width: 250,
    borderRadius:100,
    marginTop: 10
  },
  forgotPass: {
    marginTop:50,
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
};

const mapStateToProps = ({ auth }) => {
  const { error, loading } = auth

  return { error, loading }
};

export default connect(mapStateToProps, {
  loginUser
})(LoginForm)
