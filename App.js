import React, { Component } from 'react'
import { View, Platform, AppState, Alert } from 'react-native'
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType, NotificationActionType} from 'react-native-fcm';
import { Header } from './components'
import Router from './Router'
import { Provider } from 'react-redux'
import store from './redux/store'

// disable all warnings in app
console.disableYellowBox = true;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      token: "",
      tokenCopyFeedback: ""
    };

  }

  componentWillUnmount() {

  }

  async componentDidMount() {

    // create NotificationChannel for future use!
    FCM.createNotificationChannel({
      id: 'my_default_channel',
      name: 'Default',
      description: 'used for example',
      priority: 'high'
    });

    // initially user get InitialNotification frim the app if any pending
    FCM.getInitialNotification().then(notif => {
      console.log("getInitialNotification Notification : => ", notif);

      // if notif.targetScreen is details screen then it will redirect to details screen directly!
      if (notif && notif.targetScreen === "detail") {
        setTimeout(() => {
          this.props.navigation.navigate("Detail");
        }, 500);
      }
    });

    // added notification listener for getting any notification called below function then
    this.notificationListener =  FCM.on(FCMEvent.Notification, async (notif) =>  {
      console.log("FCMEvent.Notification Notification : => ", notif);

      if (Platform.OS === 'ios' && notif._notificationType === NotificationType.WillPresent && !notif.local_notification) {
        notif.finish(WillPresentNotificationResult.All);
        return;
      }

      // if user tap to notification bar then open app then below condition will follow up and redirect to details screen!
      if (notif.opened_from_tray) {
        if (notif.targetScreen === 'detail') {
          setTimeout(() => {
            navigation.navigate('Detail')
          }, 500)
        }
        setTimeout(() => {
          alert(`User tapped notification\n${JSON.stringify(notif)}`)
        }, 500)
      }

      // check whether app is in background or foreground for generate notification
      if (AppState.currentState !== 'background'){
        this.showLocalNotification(notif);
      }

    });

    // getting user permission for sending notification or not ?
    try {
      let result = await FCM.requestPermissions({
        badge: true,
        sound: true,
        alert: true
      });
      console.log("Notification requestPermissions : => ", result)
    } catch (e) {
      console.error(e);
    }

    // Generating token for particular user wise send notification
    FCM.getFCMToken().then(token => {
      FCM.subscribeToTopic("Meatex_Announcement");
      console.log("Notification token : => ", token);
      this.setState({ token: token || "" });
    });

    // Get APNSTOKEN for only ios
    if (Platform.OS === "ios") {
      FCM.getAPNSToken().then(token => {
        console.log("APNS TOKEN (getFCMToken)", token);
      });
    }
  }

  // show notification when app is in foreground and getting any new notification
  showLocalNotification = (notif) => {
    FCM.presentLocalNotification({
      channel: 'my_default_channel',
      id: new Date().valueOf().toString(),
      title: notif.fcm.title,
      body: notif.fcm.body,
      priority: "high",
      badge: 1,
      number: 1,
      ticker: "My Notification Ticker",
      auto_cancel: true,
      big_text: "Show when notification is expanded",
      sub_text: "This is a subText",
      wake_screen: true,
      group: "group",
      icon: "ic_launcher",
      ongoing: true,
      my_custom_data: "my_custom_field_value",
      lights: true,
      show_in_foreground: true
    });
  };

  render() {
    return (
      <Provider store={store}>
        <View style={{flex:1}}>
          <Header />
          <Router />
        </View>
      </Provider>
    )
  }
}

export default App
