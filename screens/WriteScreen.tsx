import React, {useCallback, useState, useEffect} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Pressable,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {RootStackNavigationProp} from './types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useMutation, useQueryClient} from 'react-query';
import {writeArticle} from '../api/articles';
import {Article} from '../api/types';

export default function WriteScreen() {
  const {top} = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const queryClient = useQueryClient();
  const {mutate: write} = useMutation(writeArticle, {
    onSuccess: article => {
      /*// queryClient.invalidateQueries('articles'); // article 캐시 키를 만료시키기
      // 캐시 데이터 조회
      const articles = queryClient.getQueryData<Article[]>('articles') ?? [];
      // 캐시 데이터 업데이트
      queryClient.setQueryData('articles', articles.concat(article));*/
      // 캐시 키로 데이터를 조회한 후 그 데이터를 업데이터 함수를 사용하여 업데이트
      queryClient.setQueryData<Article[]>('articles', articles =>
        (articles ?? []).concat(article),
      );
      navigation.goBack();
    },
  });

  const navigation = useNavigation<RootStackNavigationProp>();
  const onSubmit = useCallback(() => {
    write({title, body});
  }, [write, title, body]);

  useEffect(() => {
    navigation.setOptions({
      headerRightContainer: styles.headerRightContainer,
      headerRight: () => (
        <Pressable
          hitSlop={8}
          onPress={onSubmit}
          style={({pressed}) => pressed && styles.headerRightPressed}>
          <MaterialIcons name={'send'} color={'#2196f3'} size={24} />
        </Pressable>
      ),
    });
  }, [onSubmit, navigation]);

  return (
    <SafeAreaView style={styles.block} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.select({ios: 'padding'})}
        keyboardVerticalOffset={Platform.select({ios: top + 60})}>
        <TextInput
          placeholder={'제목'}
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder={'내용'}
          style={[styles.input, styles.body]}
          multiline
          textAlignVertical={'top'}
          value={body}
          onChangeText={setBody}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
    flexDirection: 'column',
  },
  keyboardAvoiding: {
    flex: 1,
  },
  input: {
    backgroundColor: 'white',
    fontSize: 14,
    lineHeight: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
  },
  body: {
    paddingTop: 12,
    paddingBottom: 12,
    marginTop: 16,
    flex: 1,
  },
  headerRightContainer: {
    marginRight: 16,
  },
  headerRightPressed: {
    opacity: 0.75,
  },
});
