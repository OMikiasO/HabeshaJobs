import React, { useContext } from 'react'
import { ActivityIndicator, Text, View, StyleSheet, FlatList } from 'react-native'
import { Icon } from 'react-native-elements'
import { colors } from '../GlobalStyles'
import { JobContext } from '../JobContext'
import JobItem from './JobItem'

const SavedJobs = ({ navigation }) => {
	const { state } = useContext(JobContext)

	const onOpen = job => navigation.navigate('Details', { item: job })

	const renderItem = ({ item }) => <JobItem item={item} onOpen={() => onOpen(item)} />

	return (
		<View style={styles.container}>
			{state.savedJobs.length == 0 && !state.loadingSavedJobs && (
				<View style={styles.empytyInfoContainer}>
					<Icon size={100} color={colors.borderColor} name="star" />
					<Text style={styles.emptyInfo}>No saved jobs yet!</Text>
				</View>
			)}
			<FlatList
				data={state.savedJobs}
				renderItem={renderItem}
				keyExtractor={item => item.id.toString()}
				ItemSeparatorComponent={separator}
				ListFooterComponent={footer}
				ListFooterComponentStyle={{
					paddingTop: 10,
					display: state.loadingSavedJobs ? 'flex' : 'none'
				}}
			></FlatList>
		</View>
	)
}

export default SavedJobs

const separator = () => <View style={styles.separator}></View>

const footer = () => <ActivityIndicator size="large" color={colors.accent} />

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
		alignItems: 'center'
	},
	emptyInfo: {
		color: colors.borderColor,
		fontSize: 30,
		textAlign: 'center'
	}
})
