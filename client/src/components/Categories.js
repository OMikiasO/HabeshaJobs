//import liraries
import React, { useContext, useMemo } from 'react'
import { View, Text, StyleSheet, Image, ScrollView, useWindowDimensions, FlatList, TouchableOpacity } from 'react-native'
import { colors, fonts } from '../GlobalStyles'
import { Actions, JobContext } from '../JobContext'
import LinearGradient from 'react-native-linear-gradient'

// create a component
const Categories = () => {
	const { categories } = useContext(JobContext)

	const renderItem = ({ item }) => <Category item={item} />
	return (
		<View style={styles.container}>
			<Text style={{ fontFamily: fonts.boldFont, color: colors.text, fontSize: 23, padding: 10 }}>Categories</Text>
			<FlatList data={categories} keyExtractor={item => item.value} renderItem={renderItem} horizontal></FlatList>

			<View style={{ width: '100%', height: 0.5, backgroundColor: colors.borderColor, marginTop: 15 }} />
		</View>
	)
}

const Category = ({ item }) => {
	const { state, dispatch } = useContext(JobContext)
	const windowDimensions = useWindowDimensions()
	const selected = useMemo(() => state.filters.category == item.value, [state])

	const onSelect = () => {
		dispatch({ type: Actions.Filter, payload: { ...state.filters, category: item.value } })
	}

	return (
		<TouchableOpacity
			onPress={onSelect}
			style={{
				width: windowDimensions.width / 4,
				margin: 4,
				borderRadius: 16,
				borderWidth: 1,
				borderColor: selected ? colors.accent : colors.black
			}}
		>
			<Image
				style={{ width: '100%', height: 175, borderRadius: 15 }}
				source={{
					uri: item.image
				}}
			/>
			{item.imageColor && (
				<LinearGradient colors={[selected ? colors.accentMidShade : item.imageColor, '#00000000', '#00000000']} style={styles.linearGradient}>
					<Text style={styles.categoryName}>{item.name}</Text>
				</LinearGradient>
			)}
		</TouchableOpacity>
	)
}

// define your styles
const styles = StyleSheet.create({
	container: {
		width: '100%'
		// height: 300
	},
	linearGradient: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		borderRadius: 15
	},
	categoryName: {
		color: '#fff',
		textAlign: 'center',
		padding: 5,
		fontSize: 18,
		textShadowColor: '#00000050',
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 1
	}
})

//make this component available to the app
export default Categories
