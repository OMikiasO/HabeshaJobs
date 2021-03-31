import React from 'react'
import { StyleSheet, View } from 'react-native'
import AllJobs from '../components/AllJobs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { colors, fonts } from '../GlobalStyles'
import SavedJobs from '../components/SavedJobs'
const Tab = createMaterialTopTabNavigator()

const Home = () => {
	return (
		<View style={styles.container}>
			<Tab.Navigator
				sceneContainerStyle={{ backgroundColor: colors.black }}
				tabBarOptions={{
					tabStyle: { height: 35 },
					labelStyle: {
						paddingBottom: 12,
						margin: 0,
						fontSize: 16,
						fontFamily: fonts.normalFont
					},
					activeTintColor: colors.text,
					style: {
						backgroundColor: colors.black,
						borderBottomWidth: 0.5,
						borderBottomColor: colors.borderColor
					},
					indicatorStyle: {
						height: '100%',
						backgroundColor: colors.blackTint
					}
				}}
			>
				<Tab.Screen name="All Jobs" component={AllJobs} />
				<Tab.Screen name="Saved Jobs" component={SavedJobs} />
			</Tab.Navigator>
		</View>
	)
}

export default Home

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.black,
		flex: 1
	}
})
