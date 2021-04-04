import React, { useContext, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { colors, fonts } from '../GlobalStyles'
import { StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements'
import TimeAgo from 'javascript-time-ago'

// English.
import en from 'javascript-time-ago/locale/en'
try {
	TimeAgo.addDefaultLocale(en)
} catch (err) {}
const timeAgo = new TimeAgo()

import { TouchableNativeFeedback } from 'react-native'
import { Actions, JobContext } from '../JobContext'
import { ToastAndroid } from 'react-native'

const JobItem = ({ item, onOpen }) => {
	TimeAgo.local
	const { state, dispatch, categories } = useContext(JobContext)
	const [isSaved, setIsSaved] = useState(false)
	const onSavePressed = async () => dispatch({ type: Actions.ChangeItem, payload: item.id })

	useEffect(() => {
		state.savedJobs.filter(job => job.id == item.id).length > 0 ? setIsSaved(true) : setIsSaved(false)
	}, [state])

	const getCategory = value => {
		let category = categories.find(cat => cat.value == value)
		return category ? category : categories[categories.length - 1]
	}

	return (
		<TouchableNativeFeedback onPress={onOpen} background={TouchableNativeFeedback.Ripple(colors.textShade)}>
			<View style={styles.container}>
				<View style={styles.iconContainer}>
					<Icon size={30} color={getCategory(item.Category).color} name={getCategory(item.Category).iconName} />
				</View>
				<View style={styles.detailConainer}>
					<View style={styles.titleAndSaveBtnContainer}>
						<View style={styles.titleAndVerfiedContainer}>
							<Text numberOfLines={1} style={styles.title}>
								{item['Job Title']}
							</Text>
							{item.Verified && <Icon size={15} color={colors.accent} name="verified" />}
						</View>
						{item.Closed && (
							<Text
								style={{
									color: colors.danger,
									marginLeft: 'auto',
									backgroundColor: colors.dangerShade,
									paddingVertical: 3,
									paddingHorizontal: 8,
									borderRadius: 5
								}}
							>
								Closed
							</Text>
						)}
						{state.changingItem === item.id ? (
							<View style={styles.saveIconContainer}>
								<ActivityIndicator size="small" color={colors.accent} />
							</View>
						) : (
							<TouchableOpacity style={{ zIndex: 300 }} onPress={onSavePressed}>
								<Icon
									containerStyle={[styles.saveIconContainer, { backgroundColor: isSaved ? colors.accent : colors.accentShade }]}
									size={18}
									color={colors.black}
									name="star"
								/>
							</TouchableOpacity>
						)}
					</View>
					<Text style={styles.decription} numberOfLines={2}>
						{item.Description}
					</Text>
					<View style={styles.tagsAndTimeContainer}>
						<View style={styles.tagsContainer}>
							<Tag tagText={item['Category']} />
							<Tag tagText={item['Job Type']} />
							<Tag tagText={item['Company']} />
						</View>
						<Text style={styles.time}>{timeAgo.format(item.t, 'mini')} ago</Text>
					</View>
				</View>
			</View>
		</TouchableNativeFeedback>
	)
}

const propsAreEqual = (prevProps, nextProps) => {
	return prevProps.item.Closed === nextProps.item.Closed
}

export default React.memo(JobItem, propsAreEqual)

const Tag = ({ tagText }) => {
	if (!tagText) return null
	return (
		tagText && (
			<View style={styles.tag}>
				<Text style={styles.tagText}>#{tagText.toLowerCase()}</Text>
			</View>
		)
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		padding: 10,
		backgroundColor: colors.black
	},
	iconContainer: {
		backgroundColor: colors.borderColor,
		height: 55,
		width: 55,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 15,
		marginRight: 10,
		marginVertical: 7
	},

	titleAndSaveBtnContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},

	titleAndVerfiedContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		flexShrink: 1
	},
	title: {
		color: colors.text,
		fontFamily: fonts.normalFont,
		fontSize: 17,
		padding: 5,
		paddingRight: 8,
		flexShrink: 1
	},

	saveIconContainer: {
		padding: 3,
		marginLeft: 5,
		borderRadius: 5
	},

	detailConainer: { flex: 1 },

	decription: {
		color: colors.textShade,
		fontFamily: fonts.normalFont,
		fontSize: 13,
		padding: 5,
		paddingBottom: 0
	},
	time: {
		fontSize: 13,
		color: colors.textShade
	},
	tagsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		flexShrink: 1
	},
	tag: {
		backgroundColor: colors.blackTint,
		borderRadius: 5,
		margin: 5,
		paddingHorizontal: 5
	},
	tagText: {
		color: colors.textShade,
		fontSize: 13
	},
	tagsAndTimeContainer: {
		flexDirection: 'row',
		flexGrow: 0,
		justifyContent: 'space-between',
		alignItems: 'center'
	}
})
