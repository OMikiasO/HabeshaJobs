import React from 'react';
import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {colors} from '../GlobalStyles';

const CustomButton = ({
  title,
  onPress,
  containerStyle,
  textStyle,
  icon,
  style,
}) => {
  return (
    <TouchableNativeFeedback
      style={style}
      onPress={onPress}
      background={TouchableNativeFeedback.Ripple(colors.textShade)}>
      <View style={[styles.container, {...containerStyle}]}>
        <View style={styles.iconAndTextContainer}>
          {icon && (
            <Icon
              type="material"
              size={22}
              color={textStyle.color}
              name={icon}
            />
          )}
          {icon && <View style={{width: 10}} />}
          <Text style={[styles.title, {...textStyle}]}>{title}</Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },

  title: {
    fontSize: 16,
  },

  iconAndTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
