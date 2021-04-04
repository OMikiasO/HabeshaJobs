import React, { useState, useContext, useEffect } from 'react'
import { Picker } from '@react-native-picker/picker'
import { StyleSheet, Text, View } from 'react-native'
import { colors } from '../GlobalStyles'
import CustomButton from './CustomButton'
import { Actions, JobContext } from '../JobContext'

const Filters = ({ onClose, onFilter, popup }) => {
	const { dispatch, categories, jobTypes, state } = useContext(JobContext)
	const [filters, setFilters] = useState({ category: 'all', jobType: 'all' })

	const filter = async () => {
		dispatch({ type: Actions.Filter, payload: filters })
		onClose()
		onFilter()
	}

	useEffect(() => {
		// if popup is 'filters' it means the filters popup is opened
		if (popup == 'filters') setFilters(state.filters)
	}, [popup])

	const onCategorySelected = itemValue => setFilters(currValue => ({ ...currValue, category: itemValue }))
	const onJobTypeSelected = itemValue => setFilters(currValue => ({ ...currValue, jobType: itemValue }))

	return (
		<View style={styles.main}>
			<Text style={[styles.header]}>Categories</Text>

			<View style={styles.picker}>
				<Picker dropdownIconColor={colors.accent} style={{ color: colors.text }} selectedValue={filters.category} onValueChange={onCategorySelected}>
					{categories.map(cat => (
						<Picker.Item key={cat.value} label={cat.name} value={cat.value} />
					))}
				</Picker>
			</View>

			<Text style={[styles.header, { paddingTop: 10 }]}>Job types</Text>

			<View style={styles.picker}>
				<Picker dropdownIconColor={colors.accent} style={{ color: colors.text }} selectedValue={filters.jobType} onValueChange={onJobTypeSelected}>
					{jobTypes.map(type => (
						<Picker.Item key={type.value} label={type.name} value={type.value} />
					))}
				</Picker>
			</View>

			<View style={styles.buttons}>
				<CustomButton
					title="Filter"
					onPress={filter}
					containerStyle={{ marginTop: 20, backgroundColor: colors.text }}
					textStyle={{ color: colors.blackTint }}
				/>
				<View style={{ width: 15 }} />
				<CustomButton
					title="Cancle"
					onPress={onClose}
					containerStyle={{ marginTop: 20, backgroundColor: colors.borderColor }}
					textStyle={{ color: colors.text }}
				/>
			</View>
		</View>
	)
}

export default Filters

const styles = StyleSheet.create({
	main: {
		padding: 15
	},

	header: {
		color: colors.text,
		fontSize: 20
	},

	picker: {
		marginTop: 10,
		overflow: 'hidden',
		backgroundColor: colors.blackTint,
		borderRadius: 5,
		paddingHorizontal: 7,
		paddingVertical: 3
	},

	buttons: {
		flexDirection: 'row'
	}
})
