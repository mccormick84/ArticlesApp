import client from './client';
import {Article} from './types';

export async function getArticles({
  limit = 10,
  cursor,
  prevCursor,
}: {
  limit?: number;
  cursor?: number;
  prevCursor?: number;
}) {
  const response = await client.get<Article[]>('/articles', {
    params: {
      _sort: 'id:DESC',
      _limit: limit,
      id_lt: cursor,
      id_gt: prevCursor,
    },
  });
  return response.data;
}

export async function getArticle(id: number) {
  const response = await client.get<Article>(`/articles/${id}`);
  return response.data;
}

//게시글 작성
export async function writeArticle(params: {title: string; body: string}) {
  const response = await client.post<Article>('/articles', params);
  return response.data;
}

//게시글 수정
export async function modifyArticle(params: {
  id: number;
  title: string;
  body: string;
}) {
  const {id, title, body} = params;
  const response = await client.put<Article>(`/articles/${id}`, {title, body});
  return response.data;
}

// 게시글 삭제
export async function deleteArticle(id: number) {
  await client.delete<Article>(`/articles/${id}`);
  return null;
}
