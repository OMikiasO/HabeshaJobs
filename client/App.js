import 'react-native-gesture-handler'
import React, { useEffect, useRef } from 'react'
import { Animated, Platform, SafeAreaView, StatusBar, StyleSheet, UIManager, View, Text } from 'react-native'
import Home from './src/screens/Home'
import JobProvider from './src/JobContext'
import { NavigationContainer } from '@react-navigation/native'
import { colors } from './src/GlobalStyles'
import messaging from '@react-native-firebase/messaging'
import PushNotification from 'react-native-push-notification'
import Header from './src/components/Header'
import { useNetInfo } from '@react-native-community/netinfo'

import { createStackNavigator } from '@react-navigation/stack'
import Snackbar from 'react-native-snackbar'
import Details from './src/screens/Details'
const Stack = createStackNavigator()

import { TransitionPresets } from '@react-navigation/stack'

if (Platform.OS === 'android') {
	if (UIManager.setLayoutAnimationEnabledExperimental) {
		UIManager.setLayoutAnimationEnabledExperimental(true)
	}
}

export default function App() {
	const nav = useRef(null)
	const netInfo = useNetInfo()

	useEffect(() => {
		if (netInfo.isConnected === false) {
			console.log(netInfo)
			Snackbar.show({
				text: 'Disconnected',
				duration: Snackbar.LENGTH_INDEFINITE,
				backgroundColor: colors.dangerShade,
				textColor: colors.danger,
				action: {
					text: 'Close',
					textColor: colors.text
				}
			})
		} else Snackbar.dismiss()
	}, [netInfo])

	useEffect(() => {
		const unsubscribe = messaging().onMessage(async remoteMessage => {
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
			console.log(JSON.stringify(remoteMessage))
		})

		return unsubscribe
	}, [])

	const config = {
		screens: {
			Details: 'details/:id'
		}
	}

	const linking = {
		prefixes: ['https://habeshajobs.com', 'habeshajobs://'],
		config
	}

	return (
		<NavigationContainer linking={linking} ref={nav} theme={{ colors: { background: '#000' } }}>
			<JobProvider>
				<FadeInView style={styles.fadeIn}>
					<SafeAreaView style={styles.container}>
						<Header nav={nav} />
						<StatusBar backgroundColor={colors.black} />
						<Stack.Navigator
							headerMode="none"
							mode="modal"
							screenOptions={{
								gestureEnabled: true,
								cardStyle: { backgroundColor: '#000' } // this makes the bg of the stack navigator black eliminating white line when screens are opened
							}}
						>
							<Stack.Screen name="Home" component={Home} />
							<Stack.Screen
								name="Details"
								component={Details}
								options={{
									title: 'Profile',
									...TransitionPresets.SlideFromRightIOS
								}}
							/>
						</Stack.Navigator>
					</SafeAreaView>
				</FadeInView>
			</JobProvider>
		</NavigationContainer>
	)
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 128,
		backgroundColor: '#000'
	},
	fadeIn: {
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		position: 'absolute'
	}
})

const FadeInView = props => {
	const fadeAnim = useRef(new Animated.Value(0)).current // Initial value for opacity: 0

	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 1000,
			useNativeDriver: true
		}).start()
	}, [fadeAnim])

	return (
		<Animated.View // Special animatable View
			style={{
				...props.style,
				opacity: fadeAnim // Bind opacity to animated value
			}}
		>
			{props.children}
		</Animated.View>
	)
}
