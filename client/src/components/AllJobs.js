import React, { useContext, useEffect } from 'react'
import { ActivityIndicator, RefreshControl, View, StyleSheet, FlatList, Text } from 'react-native'
import { colors } from '../GlobalStyles'
import { Actions, JobContext } from '../JobContext'
import JobItem from './JobItem'
import { Icon } from 'react-native-elements'
import { useNetInfo } from '@react-native-community/netinfo'
import Categories from './Categories'

const AllJobs = ({ navigation }) => {
	const { state, dispatch } = useContext(JobContext)
	const netInfo = useNetInfo()

	const refresh = () => dispatch({ type: Actions.Refresh })

	const onOpen = job => navigation.navigate('Details', { item: job })

	const onEndReached = () => {
		if (!state.lastDoc || state.loading) return
		dispatch({ type: Actions.LoadMore })
	}

	const renderItem = ({ item, index }) => <JobItem item={item} onOpen={() => onOpen(item)} />

	return (
		<View style={styles.container}>
			<FlatList
				data={state.jobs}
				renderItem={renderItem}
				keyExtractor={item => item.id.toString()}
				ItemSeparatorComponent={separator}
				onEndReached={onEndReached}
				extraData={state.savedJobs}
				onEndReachedThreshold={0.1}
				ListHeaderComponent={Categories}
				ListFooterComponent={state.jobs.length ? footer : state.loading && footer}
				ListEmptyComponent={() => !state.loading && <NoResults netInfo={netInfo} />}
				ListFooterComponentStyle={{
					paddingTop: 10,
					display: state.hasLoadedAllItems ? 'none' : 'flex'
				}}
				refreshControl={<RefreshControl enabled={true} onRefresh={refresh} refreshing={state.refreshing} />}
			></FlatList>
		</View>
	)
}

export default AllJobs

const separator = () => <View style={styles.separator}></View>

const footer = () => <ActivityIndicator size="large" color={colors.accent} />

const NoResults = ({ netInfo }) => (
	<View style={styles.empytyInfoContainer}>
		<Icon size={100} color={colors.borderColor} name={netInfo.isConnected === true ? 'list-alt' : 'signal-wifi-off'} />
		<Text style={styles.emptyInfo}>{netInfo.isConnected === true ? 'No results' : 'No internet connection'}</Text>
	</View>
)

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'black',
		flex: 1
	},
	separator: {
		height: 0.8,
		backgroundColor: colors.borderColor,
		width: '90%',
		alignSelf: 'center'
	},

	empytyInfoContainer: {
		alignItems: 'center',
		backgroundColor: colors.black,
		// position: 'absolute',
		zIndex: 200,
		flex: 1,
		width: '100%'
	},
	emptyInfo: {
		color: colors.borderColor,
		fontSize: 30,
		textAlign: 'center'
	}
})
