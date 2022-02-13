import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import {RootStackNavigationProp} from '../screens/types';

export interface ArticleActionButtonsProps {
  articleId: number;
}

export default function ArticleActionButtons({
  articleId,
}: ArticleActionButtonsProps) {
  const navigation = useNavigation<RootStackNavigationProp>();
  const onPressModify = () => {
    navigation.navigate('Write', {articleId});
  };
  const onPressRemove = () => {
    //TODO: 구현 예정
  };
  return (
    <View style={styles.block}>
      <Pressable
        onPress={onPressModify}
        style={({pressed}) => pressed && styles.pressed}>
        <Text style={styles.buttonText}>수정</Text>
      </Pressable>
      <View style={styles.separator} />
      <Pressable
        onPress={onPressRemove}
        style={({pressed}) => pressed && styles.pressed}>
        <Text style={styles.buttonText}>삭제</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginTop: -16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  separator: {
    width: 8,
  },
  buttonText: {
    color: '#2196f3',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.75,
  },
});