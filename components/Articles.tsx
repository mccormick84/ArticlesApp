import React from 'react';
import {Article} from '../api/types';
import {FlatList, View, StyleSheet} from 'react-native';
import ArticleItem from './ArticleItem';

export interface ArticlesProps {
  articles: Article[];
}

export default function Articles({articles}: ArticlesProps) {
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
      ListFooterComponent={() =>
        // articles가 1개 이상 있을 때만 최하단 테두리 보여주기
        articles.length > 0 ? <View style={styles.separator} /> : null
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {flex: 1},
  separator: {width: '100%', height: 1, backgroundColor: '#cfd8dc'},
});
