import React from 'react';
import {Article} from '../api/types';
import {
  FlatList,
  View,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import ArticleItem from './ArticleItem';
import WriteButton from './WriteButton';

export interface ArticlesProps {
  articles: Article[];
  showWriteButton?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage(): void;
  refresh(): void;
  isRefreshing: boolean;
}

export default function Articles({
  articles,
  showWriteButton,
  isFetchingNextPage,
  fetchNextPage,
  refresh,
  isRefreshing,
}: ArticlesProps) {
  return (
    <FlatList
      data={articles}
      renderItem={({item}) => (
        <ArticleItem
          id={item.id}
          title={item.title}
          publishedAt={item.published_at}
          username={item.user.username}
        />
      )}
      keyExtractor={item => item.id.toString()}
      style={styles.list}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={() => (showWriteButton ? <WriteButton /> : null)}
      ListFooterComponent={() => (
        <>
          {articles.length > 0 ? <View style={styles.separator} /> : null}
          {isFetchingNextPage && (
            <ActivityIndicator
              size={'small'}
              color={'black'}
              style={styles.spinner}
            />
          )}
        </>
      )}
      onEndReachedThreshold={0.5}
      onEndReached={fetchNextPage}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {flex: 1},
  separator: {width: '100%', height: 1, backgroundColor: '#cfd8dc'},
  spinner: {
    backgroundColor: 'white',
    paddingTop: 32,
    paddingBottom: 32,
  },
});
