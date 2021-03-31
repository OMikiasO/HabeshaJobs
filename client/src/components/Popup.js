import React, { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet } from 'react-native'
import { colors } from '../GlobalStyles'

const Popup = ({ toggle, children }) => {
	const scaleAnim = useRef(new Animated.Value(0)).current
	const transXAnim = useRef(new Animated.Value(0)).current
	const transYAnim = useRef(new Animated.Value(0)).current
	const opacityAnim = useRef(new Animated.Value(0)).current
	const animOps = {
		duration: 400,
		easing: Easing.elastic(1),
		useNativeDriver: true
	}

	useEffect(() => {
		Animated.parallel([
			Animated.timing(scaleAnim, { toValue: toggle ? 1 : 0.95, ...animOps }),
			Animated.timing(transXAnim, { toValue: toggle ? 0 : 25, ...animOps }),
			Animated.timing(transYAnim, { toValue: toggle ? 50 : -3, ...animOps }),
			Animated.timing(opacityAnim, { toValue: toggle ? 1 : 0, ...animOps })
		]).start()
	}, [toggle])

	return (
		<Animated.View
			style={[
				styles.animView,
				{
					scaleX: scaleAnim,
					scaleY: scaleAnim,
					translateX: transXAnim,
					translateY: transYAnim,
					opacity: opacityAnim
				}
			]}
		>
			{children}
		</Animated.View>
	)
}

export default Popup

const styles = StyleSheet.create({
	animView: {
		position: 'absolute',
		top: 150,
		right: 25,
		left: 25,
		borderRadius: 20,
		backgroundColor: '#000000cc',
		borderWidth: 5,
		borderColor: colors.borderColor,
		zIndex: 100
	}
})
