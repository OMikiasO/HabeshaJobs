/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import messaging from '@react-native-firebase/messaging'
import firestore from '@react-native-firebase/firestore'

messaging().setBackgroundMessageHandler(async remoteMessage => {
	console.log('Message handled in the background!')
	PushNotification.localNotification({
		channelId: 'channel-id',
		message: remoteMessage.data.body,
		title: remoteMessage.data.title,
		actions: JSON.parse(remoteMessage.data.actions),
		invokeApp: false,
		jobId: remoteMessage.data.jobId,
		largeIconUrl: remoteMessage.data.largeIconUrl,
		smallIcon: 'ic_stat_name',
		color: '#00d1e0'
	})
})

// import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from 'react-native-push-notification'
import { Linking } from 'react-native'
import { ToastAndroid } from 'react-native'

let appIsOpen = false

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
	// (optional) Called when Token is generated (iOS and Android)
	onRegister: function (token) {
		appIsOpen = true
	},

	// // (required) Called when a remote is received or opened, or local notification is opened
	onNotification: function (notification) {
		setTimeout(() => Linking.openURL(`habeshajobs://details/${notification.jobId}`), appIsOpen ? 100 : 1500)

		// process the notification

		// (required) Called when a remote is received or opened, or local notification is opened
		// notification.finish(PushNotificationIOS.FetchResult.NoData);
	},

	// (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
	onAction: function (notification) {
		messaging()
			.getToken()
			.then(token => {
				let docRef = firestore().collection('jobs').doc(notification.jobId)
				if (notification.action == 'Remove from saved') {
					docRef.update({ savedBy: firestore.FieldValue.arrayRemove(token) })
				} else if (notification.action == 'Save') {
					promise = docRef.update({ savedBy: firestore.FieldValue.arrayUnion(token) })
					ToastAndroid.show('Job saved', 1000)
				}
			})
	},

	// (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
	onRegistrationError: function (err) {
		console.error(err.message, err)
	},

	// IOS ONLY (optional): default: all - Permissions to register.
	permissions: {
		alert: true,
		badge: true,
		sound: true
	},

	// Should the initial notification be popped automatically
	// default: true
	popInitialNotification: true,

	/**
	 * (optional) default: true
	 * - Specified if permissions (ios) and token (android and ios) will requested or not,
	 * - if not, you must call PushNotificationsHandler.requestPermissions() later
	 * - if you are not using remote notification or do not have Firebase installed, use this:
	 *     requestPermissions: Platform.OS === 'ios'
	 */
	requestPermissions: true
})

PushNotification.createChannel(
	{
		channelId: 'channel-id', // (required)
		channelName: 'New jobs notification', // (required)
		channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
		playSound: false, // (optional) default: true
		soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
		importance: 4, // (optional) default: 4. Int value of the Android notification importance
		vibrate: true // (optional) default: true. Creates the default vibration patten if true.
	},
	created => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
)

AppRegistry.registerComponent(appName, () => App)
