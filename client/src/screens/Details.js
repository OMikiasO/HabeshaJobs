import React, { useEffect, useContext, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Linking, ActivityIndicator, Share } from 'react-native'
import { Icon } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'
import CustomButton from '../components/CustomButton'
import { colors } from '../GlobalStyles'
import { createShareContent } from '../Utils'
import { Actions, JobContext, getJob } from '../JobContext'

// create a component
const Details = ({ route, navigation }) => {
	const [item, setItem] = useState(route.params.item)

	const [isSaved, setIsSaved] = useState(false)
	const { state, dispatch, categories } = useContext(JobContext)

	const isFirstRun = useRef(true)

	const onSavePressed = async () => dispatch({ type: Actions.ChangeItem, payload: item.id })

	useEffect(() => {
		console.log(route.params.id, ' -- - - - --------------------------------------')
		const id = route.params.id
		if (id) {
			setItem(undefined)
			getJob(id).then(job => setItem(job))
		}
	}, [route])

	useEffect(() => {
		state.savedJobs.filter(job => job.id == item?.id).length > 0 ? setIsSaved(true) : setIsSaved(false)
	}, [state])

	useEffect(() => {
		if (isFirstRun.current | (state.searchTerm.length == 0)) {
			isFirstRun.current = false
			return
		}
		navigation.goBack()
	}, [state.searchTerm])

	const getCategory = value => {
		let category = categories.find(cat => cat.value == value)
		return category ? category : categories[categories.length - 1]
	}

	return (
		<View style={{ flex: 1 }}>
			{!item ? (
				<ActivityIndicator size="large" style={{ alignSelf: 'center' }} color={isSaved ? colors.danger : colors.accent} />
			) : (
				<View style={{ flex: 1 }}>
					{item.Closed && (
						<Text
							style={{
								width: '100%',
								padding: 7,
								backgroundColor: colors.dangerShade,
								color: colors.danger,
								fontSize: 18,
								textAlign: 'center'
							}}
						>
							Job is closed
						</Text>
					)}
					<ScrollView style={styles.scrollView}>
						<View style={styles.container}>
							<View style={styles.header}>
								<Icon
									type="material"
									size={27}
									color={getCategory(item.Category).color}
									name={getCategory(item.Category).iconName}
									containerStyle={styles.iconContainer}
								/>
								<Text style={styles.title}>{item['Job Title']}</Text>
								<Text style={styles.jobType}>{item['Job Type']}</Text>
								<View style={styles.buttonsContainer}>
									{state.changingItem === item.id ? (
										<View
											style={{
												marginTop: 20,
												width: '30%',
												flexGrow: 0,
												alignItems: 'center',
												borderRadius: 5,
												justifyContent: 'center',
												backgroundColor: isSaved ? colors.dangerShade : colors.accentShade
											}}
										>
											<ActivityIndicator size="small" color={isSaved ? colors.danger : colors.accent} />
										</View>
									) : (
										<CustomButton
											onPress={onSavePressed}
											title={isSaved ? 'Unsave' : 'Save'}
											icon={isSaved ? 'close' : 'favorite'}
											containerStyle={{
												marginTop: 20,
												width: '30%',
												flexGrow: 0,
												backgroundColor: isSaved ? colors.dangerShade : colors.accentShade
											}}
											textStyle={{ color: isSaved ? colors.danger : colors.accent }}
										/>
									)}

									<View style={{ width: 15 }} />
									<CustomButton
										title="Share"
										icon="share"
										onPress={() => onShare(item)}
										containerStyle={{
											marginTop: 20,
											width: '30%',
											flexGrow: 0,
											backgroundColor: colors.blackTint
										}}
										textStyle={{ color: colors.text }}
									/>
								</View>
							</View>
							{item['Description'] && (
								<View>
									<Text style={styles.descriptionTitle}>Description</Text>
									<Text dataDetectorType="all" style={{ color: colors.textMidShade }}>
										{item['Description'].replace(/\n/g, '\n\n')}
									</Text>
								</View>
							)}
						</View>
						{item['To Apply'] && <Text style={[styles.descriptionTitle, { fontSize: 16 }]}>To Apply : {item['To Apply']}</Text>}
					</ScrollView>

					<View style={styles.contactsContainer}>
						<Text style={[styles.descriptionTitle, { paddingBottom: 30 }]}>Contact :</Text>
						{item.Contacts.map((contact, i) => (
							<TouchableOpacity key={i} onPress={() => onContactPressed(contact)}>
								<View style={styles.singleContactContainer}>
									<Icon type="font-awesome-5" size={30} color={colors.text} name={contact.icon} containerStyle={styles.contactIconContainer} />
									<Text style={{ color: colors.textShade }}>{contact.name}</Text>
								</View>
							</TouchableOpacity>
						))}
					</View>
				</View>
			)}
		</View>
	)
}

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		backgroundColor: colors.black
	},

	header: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 30
	},

	iconContainer: {
		height: 55,
		width: 55,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 15,
		backgroundColor: colors.borderColor,
		margin: 30,
		marginTop: 40
	},

	title: {
		fontSize: 25,
		color: colors.text,
		textAlign: 'center'
	},

	jobType: {
		fontSize: 18,
		color: colors.textShade,
		textAlign: 'center'
	},

	buttonsContainer: {
		flexDirection: 'row',
		justifyContent: 'center'
	},

	descriptionTitle: {
		color: colors.text,
		fontSize: 22,
		padding: 20
	},

	scrollView: {
		flex: 1,
		marginBottom: 100
	},

	contactsContainer: {
		height: 100,
		borderTopWidth: 0.5,
		borderTopColor: colors.borderColor,
		flexDirection: 'row',
		alignItems: 'center',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0
	},

	contactIconContainer: {
		height: 55,
		width: 55,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 30,
		backgroundColor: colors.black,
		borderColor: colors.text,
		borderWidth: 2,
		marginTop: 20
	},

	singleContactContainer: {
		alignItems: 'center',
		alignSelf: 'flex-end',
		paddingBottom: 10,
		paddingRight: 15
	}
})

//make this component available to the app
export default Details

const onContactPressed = async contact => {
	await Linking.openURL(contact.link)
}

const onShare = async job => {
	try {
		const result = await Share.share({ message: createShareContent(job), title: 'title' }, { dialogTitle: 'Share job' })
		if (result.action === Share.sharedAction) {
			if (result.activityType) {
				// shared with activity type of result.activityType
			} else {
				// shared
			}
		} else if (result.action === Share.dismissedAction) {
			// dismissed
		}
	} catch (error) {
		alert(error.message)
	}
}
