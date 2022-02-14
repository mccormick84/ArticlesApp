import React from 'react';
import {StyleSheet, ActivityIndicator, FlatList} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from './types';
import {useQuery} from 'react-query';
import {getArticle} from '../api/articles';
import {getComments} from '../api/comments';
import ArticleView from '../components/ArticleView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CommentItem from '../components/CommentItem';
import {useUserState} from '../contexts/UserContext';
import CommentInput from '../components/CommentInput';

type ArticleScreenRouteProp = RouteProp<RootStackParamList, 'Article'>;

export default function ArticleScreen() {
  const {params} = useRoute<ArticleScreenRouteProp>();
  const {id} = params;
  const [currentUser] = useUserState();

  const articleQuery = useQuery(['article', id], () => getArticle(id));
  const commentsQuery = useQuery(['comments', id], () => getComments(id));

  const {bottom} = useSafeAreaInsets();

  // 둘 중 하나라도 준비되지 않은 데이터가 있으면 스피너 보여주기
  if (!articleQuery.data || !commentsQuery.data) {
    return (
      <ActivityIndicator
        size={'large'}
        style={styles.spinner}
        color={'black'}
      />
    );
  }

  const {title, body, published_at, user} = articleQuery.data;
  const isMyArticle = currentUser?.id === user.id;

  return (
    <FlatList
      style={styles.flatList}
      // 홈버튼이 없는 ios 기종에 대응하기 위해 userSafeAreaInsets()를 사용하여 화면 하단 필수 여백 크기를 가져오고,
      // 이를 contentContainerStyle의 paddingBottom으로 지정
      contentContainerStyle={[styles.flatListContent, {paddingBottom: bottom}]}
      data={commentsQuery.data}
      renderItem={({item}) => (
        <CommentItem
          id={item.id}
          message={item.message}
          username={item.user.username}
          publishedAt={item.published_at}
        />
      )}
      keyExtractor={item => item.id.toString()}
      ListHeaderComponent={
        <>
          <ArticleView
            title={title}
            body={body}
            publishedAt={published_at}
            username={user.username}
            id={id}
            isMyArticle={isMyArticle}
          />
          <CommentInput articleId={id} />
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
  },
  flatList: {
    backgroundColor: 'white',
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 12,
  },
});
