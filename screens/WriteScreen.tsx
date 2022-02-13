import React, {useCallback, useState, useEffect, useMemo} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Pressable,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RootStackNavigationProp, RootStackParamList} from './types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {InfiniteData, useQueryClient, useMutation} from 'react-query';
import {modifyArticle, writeArticle} from '../api/articles';
import {Article} from '../api/types';

type WriteScreenRouteProp = RouteProp<RootStackParamList, 'Write'>;

export default function WriteScreen() {
  const {params} = useRoute<WriteScreenRouteProp>();
  const queryClient = useQueryClient();
  //params.id가 존재한다면 querClient를 통해 캐시 조회
  const cachedArticle = useMemo(
    () =>
      params.articleId
        ? queryClient.getQueryData<Article>(['article', params.articleId])
        : null,
    [queryClient, params.articleId],
  );
  const {top} = useSafeAreaInsets();
  // 캐시된 데이터가 존재한다면 해당 데이터 정보를 초기값으로 사용
  const [title, setTitle] = useState(cachedArticle?.title ?? '');
  const [body, setBody] = useState(cachedArticle?.body ?? '');

  const {mutate: write} = useMutation(writeArticle, {
    onSuccess: article => {
      queryClient.setQueryData<InfiniteData<Article[]>>('articles', data => {
        if (!data) {
          return {
            pageParams: [undefined],
            page: [[article]],
          };
        }
        // 첫 번째 페이지와 나머지 페이지를 구분
        const [firstPage, ...rest] = data.pages;
        return {
          ...data,
          // 첫 번째 페이지에 article을 맨 앞에 추가, 그라고 그 뒤에 나머지 페이지
          pages: [[article, ...firstPage], ...rest],
        };
      });
      navigation.goBack();
    },
  });

  const {mutate: modify} = useMutation(modifyArticle, {
    onSuccess: article => {
      // 게시글 목록 수정
      queryClient.setQueryData<InfiniteData<Article[]>>('articles', data => {
        // data의 타입이 undefined가 아님을 명시하기 위해 추가
        // modify의 경우 data가 무조건 유효하기 때문에 실제로 실행될 일은 없음
        if (!data) {
          return {pageParams: [], pages: []};
        }
        return {
          pageParams: data!.pageParams,
          page: data!.pages.map(page =>
            // 수정할 항목이 있는 페이지를 찾은 후
            page.find(a => a.id === params.articleId)
              ? page.map(a => (a.id === params.articleId ? article : a))
              : page,
          ),
        };
      });
      // 게시글 수정
      queryClient.setQueryData(['article', params.articleId], article);
      navigation.goBack();
    },
  });
  const navigation = useNavigation<RootStackNavigationProp>();
  const onSubmit = useCallback(() => {
    if (params.articleId) {
      modify({id: params.articleId, title, body});
    } else {
      write({title, body});
    }
  }, [write, modify, title, body, params.articleId]);

  useEffect(() => {
    navigation.setOptions({
      headerRightContainerStyle: styles.headerRightContainer,
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
