import client from './client';
import {Article} from './types';

export async function getArticles() {
  // Article의 배열을 응답하므로 Generic에는 Article[]을 설정
  const response = await client.get<Article[]>('/articles');
  return response.data;
}
