import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

export interface CommentItemProps {
  id: number;
  message: string;
  username: string;
  publishedAt: string;
}
export default function CommentItem({
  message,
  username,
  publishedAt,
}: CommentItemProps) {
  const formattedDate = new Date(publishedAt).toLocaleString();

  return (
    <View style={styles.block}>
      <View style={styles.head}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <Text>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    fontWeight: 'bold',
  },
  date: {
    color: '#546e7a',
    fontSize: 10,
    marginTop: 4,
  },
  message: {
    marginTop: 4,
  },
});
