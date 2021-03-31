import React, { useContext, useEffect, useMemo, useState, useRef } from 'react'
import { StyleSheet, Text, View, LayoutAnimation, BackHandler } from 'react-native'
import { SearchBar, Icon, withBadge } from 'react-native-elements'
import { TouchableOpacity } from 'react-native'
import { colors, fonts } from '../GlobalStyles'
import { Actions, JobContext } from '../JobContext'
import Filters from './Filters'
import Popup from './Popup'
import NotificationSettings from './NotificationSettings'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ToastAndroid } from 'react-native'

const Header = ({ nav }) => {
	const [searchInput, setSearchInput] = useState('')
	const { state, dispatch } = useContext(JobContext)
	const [popup, setPopup] = useState('')
	const [headerHeight, setHeaderHeight] = useState(128)
	const [badgeNumber, setBadgeNumber] = useState(0)
	const [showGoBack, setShowGoBack] = useState(false)
	const [blockNotifications, setBlockNotifications] = useState(false)
	const timeout = useRef(0)
	const goBackCount = useRef(0)

	useEffect(() => {
		popup ? setHeaderHeight(1000) : setTimeout(() => setHeaderHeight(128), 400)
	}, [popup])

	useEffect(() => {
		const getSavedData = async () => {
			try {
				const value = await AsyncStorage.getItem(NOTIFICATION_SETTINGS)
				setBlockNotifications(value.split('|').length == 1)
			} catch (e) {
				console.log(e)
			}
		}
		getSavedData()
		nav.current?.addListener('state', showGoBackController)
		return () => {
			clearTimeout(timeout)
			nav.current?.removeListener('state')
		}
	}, [])

	function search(text) {
		setSearchInput(text)
		clearTimeout(timeout.current) // clears the old timer
		timeout.current = setTimeout(() => dispatch({ type: Actions.Search, payload: text }), 1000)
	}

	useEffect(() => setBadgeNumber(getBadgeNumber()), [state.filters])

	const getBadgeNumber = () => {
		let badgeNum = 0
		console.log(Object.values(state.filters))
		Object.values(state.filters).forEach(e => (e !== 'all' ? (badgeNum = badgeNum + 1) : ''))
		console.log(badgeNum)
		return badgeNum
	}

	function handleBackButtonClick() {
		console.log(nav.current.canGoBack(), nav.current)
		if (popup) setPopup(false)
		else if (nav.current.canGoBack()) nav.current.goBack()
		else if (goBackCount.current == 0) {
			goBackCount.current = 1
			setTimeout(() => (goBackCount.current = 0), 1500) // reset the count back to 0 if it is not click agian in 1.5 secs
			ToastAndroid.show('Press again to exit', ToastAndroid.SHORT)
		} else BackHandler.exitApp() // exit app if back is pressed twice in 1.5 secs
		return true
	}

	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
		return () => {
			BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick)
		}
	}, [popup])

	const BadgedIcon = useMemo(() => {
		return withBadge(badgeNumber, {
			textStyle: { color: colors.black },
			hidden: badgeNumber == 0 ? true : false,
			badgeStyle: {
				backgroundColor: colors.accent,
				borderColor: colors.black,
				color: '#000'
			}
		})(Icon)
	}, [badgeNumber])

	const showGoBackController = () => {
		setShowGoBack(nav.current.canGoBack() && nav.current.getCurrentRoute().name == 'Details')
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
	}

	return (
		<View style={[styles.container, { height: headerHeight }]}>
			<View style={styles.divider} />
			<View style={styles.titleAndProfileContainer}>
				<View style={styles.titleAndBackBtnContainer}>
					{showGoBack && (
						<TouchableOpacity onPress={() => nav.current.goBack()}>
							<Icon type="material" size={27} color={colors.text} name="arrow-back" containerStyle={{ paddingHorizontal: 10 }} />
						</TouchableOpacity>
					)}

					<Text style={styles.title}>Habesha Jobs</Text>
				</View>

				<TouchableOpacity onPress={() => setPopup(curValue => (curValue ? '' : NOTIFICATION_SETTINGS))}>
					<View style={[styles.iconContainer, { borderColor: blockNotifications ? colors.danger : colors.textShade }]}>
						<Icon
							type="material"
							size={27}
							color={blockNotifications ? colors.danger : colors.textShade}
							name={blockNotifications ? 'notifications-off' : 'notifications'}
						/>
					</View>
				</TouchableOpacity>
			</View>

			<View style={styles.searchAndFilterContainer}>
				<View style={{ flexGrow: 1 }}>
					<SearchBar
						showLoading
						loadingProps={{
							animating: state.searching,
							color: colors.accent
						}}
						placeholder="Search Here..."
						style={styles.search}
						value={searchInput}
						onChangeText={search}
						inputContainerStyle={styles.search}
						containerStyle={{
							backgroundColor: colors.black,
							padding: 0,
							width: '100%'
						}}
						placeholderTextColor={colors.textShade}
						searchIcon={{ color: colors.textShade, size: 30 }}
					/>
				</View>

				<TouchableOpacity onPress={() => setPopup(curValue => (curValue ? '' : FILTERS))}>
					<View style={styles.iconContainer}>
						<BadgedIcon size={27} color={colors.textShade} type="material" name="tune" />
					</View>
				</TouchableOpacity>
			</View>
			<Popup toggle={popup == FILTERS}>
				<Filters onClose={() => setPopup('')} onFilter={() => (showGoBack ? nav.current.goBack() : '')} />
			</Popup>
			{popup != FILTERS && (
				<Popup toggle={popup == NOTIFICATION_SETTINGS}>
					<NotificationSettings
						onSelect={noOfSelected => setBlockNotifications(noOfSelected == 1)}
						show={() => setPopup(curValue => (curValue ? '' : NOTIFICATION_SETTINGS))}
						onDone={() => setPopup('')}
					/>
				</Popup>
			)}
		</View>
	)
}

const FILTERS = 'filters'
const NOTIFICATION_SETTINGS = 'notification settings'

export default Header

const styles = StyleSheet.create({
	container: {
		padding: 10,
		overflow: 'hidden',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 1000
	},

	divider: {
		top: 127.5,
		height: 0.5,
		width: 1000,
		backgroundColor: colors.borderColor,
		position: 'absolute',
		zIndex: 5
	},

	title: {
		fontSize: 30,
		color: colors.text,
		fontFamily: fonts.boldFont
	},

	searchAndFilterContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},

	search: {
		backgroundColor: colors.blackTint,
		borderRadius: 10,
		height: 43,
		fontSize: 20,
		fontFamily: fonts.normalFont,
		color: colors.text,
		width: '100%'
	},

	titleAndProfileContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 10
		// marginTop: 10,
	},

	titleAndBackBtnContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},

	iconContainer: {
		margin: 8,
		padding: 2.5,
		borderColor: colors.textShade,
		borderWidth: 1,
		borderRadius: 100,
		width: 35,
		height: 35,
		alignContent: 'center',
		justifyContent: 'center'
	}
})
