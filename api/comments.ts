import client from './client';
import {Comment} from './types';

// 댓글 불러오기
export async function getComments(articleId: number) {
  const response = await client.get<Comment[]>(
    `/articles/${articleId}/comments`,
  );
  return response.data;
}

// 댓글 작성
export async function writeComment(params: {
  articleId: number;
  message: string;
}) {
  const {articleId, message} = params;
  const response = await client.post<Comment>(
    `/articles/${articleId}/comments`,
    {message},
  );
  return response.data;
}

// 댓글 수정
export async function modifyComment(params: {
  articleId: number;
  message: string;
  id: number;
}) {
  const {articleId, message, id} = params;
  const response = await client.put<Comment>(
    `/articles/${articleId}/comments/${id}`,
    {message},
  );
  return response.data;
}

// 댓글 삭제
export async function deleteComment(params: {articleId: number; id: number}) {
  const {articleId, id} = params;
  await client.delete(`/articles/${articleId}/comments/${id}`);
  return null;
}
