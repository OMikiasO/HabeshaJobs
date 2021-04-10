import React, { useState, useContext, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { colors } from '../GlobalStyles'
import CustomButton from './CustomButton'
import { JobContext } from '../JobContext'
import messaging from '@react-native-firebase/messaging'
import { NOTIFICATION_SETTINGS } from '../Utils'
import { CheckBox } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage'

const NotificationSettings = ({ onDone, show, onSelect }) => {
	const { categories } = useContext(JobContext)
	const [selected, setSelected] = useState(categories.map(cat => cat.value))
	const firstRun = useRef(true)

	const onCheck = value => {
		setSelected(currValue => {
			if (currValue.includes(value)) {
				messaging().unsubscribeFromTopic(value)
				return currValue.filter(v => v != value)
			} else {
				messaging().subscribeToTopic(value)
				return currValue.concat([value])
			}
		})
	}

	useEffect(() => {
		if (firstRun.current) {
			firstRun.current = false
			return
		}
		AsyncStorage.setItem(
			NOTIFICATION_SETTINGS,
			selected.reduce((p, c) => `${p}|${c}`)
		)
		onSelect(selected.length)
	}, [selected])

	const creatFirstLauchAlert = () =>
		Alert.alert('Notifications', 'Choose the types of jobs you want to get notified for.', [{ text: 'OK', onPress: show }])

	useEffect(() => {
		let timeout

		AsyncStorage.getItem(NOTIFICATION_SETTINGS).then(v => {
			timeout = setTimeout(() => {
				if (!v) {
					categories.forEach(cat => messaging().subscribeToTopic(cat.value))
					AsyncStorage.setItem(
						NOTIFICATION_SETTINGS,
						categories.map(cat => cat.value).reduce((p, c) => `${p}|${c}`)
					)
					creatFirstLauchAlert()
				}
			}, 3000)
			if (v) setSelected(v.split('|'))
		})

		return () => {
			if (timeout) clearTimeout(timeout)
		}
	}, [])

	return (
		<View style={styles.main}>
			<Text style={[styles.header]}>Recieve notification for</Text>
			{categories.map(
				cat =>
					cat.value !== 'all' && (
						<CheckBox
							textStyle={{ color: colors.text }}
							checkedColor={colors.accent}
							uncheckedColor={colors.accentMidShade}
							containerStyle={styles.checkboxContainer}
							key={cat.value}
							title={cat.name + ' jobs'}
							onPress={() => onCheck(cat.value)}
							checked={selected.includes(cat.value)}
						/>
					)
			)}
			<Text style={styles.info}>You will recieve upto {selected.length * 5 - 5} notifications per day.</Text>
			<View style={styles.buttons}>
				<CustomButton
					title="Done"
					onPress={onDone}
					containerStyle={{ marginTop: 20, backgroundColor: colors.text }}
					textStyle={{ color: colors.blackTint }}
				/>
			</View>
		</View>
	)
}

export default NotificationSettings

const styles = StyleSheet.create({
	main: {
		padding: 15
	},

	header: {
		color: colors.text,
		fontSize: 20
	},

	info: {
		color: colors.textMidShade,
		fontSize: 16
	},

	checkboxContainer: {
		backgroundColor: '#00000000',
		borderWidth: 0
	},

	buttons: {
		flexDirection: 'row'
	}
})
