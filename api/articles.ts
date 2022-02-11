import client from './client';
import {Article} from './types';

export async function getArticles() {
  // Article의 배열을 응답하므로 Generic에는 Article[]을 설정
  const response = await client.get<Article[]>('/articles');
  return response.data;
}

export async function getArticle(id: number) {
  const response = await client.get<Article>(`/articles/${id}`);
  return response.data;
}

//게시글을 작성하는 API 함수
export async function writeArticle(params: {title: string; body: string}) {
  const response = await client.post<Article>('/articles', params);
  return response.data;
}
