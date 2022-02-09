// 앞으로 사용할 API의 응답 결과에서 사용할 타입을 선언
// tip : 타입의 수가 다양하다면 종류별로 파일을 나눠서 작성하는 것이 좋을 수 있음
import {AxiosError} from 'axios';

export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: null | boolean;
  role: number;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: number;
  title: string;
  body: string;
  user: User;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  message: string;
  user: User;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResult {
  jwt: string;
  user: User;
}

type AuthErrorData = {
  messages: {
    id: string;
    message: string;
  }[];
}[];

export type AuthError = AxiosError<{
  statusCode: number;
  error: string;
  message: AuthErrorData;
  data: AuthErrorData;
}>;
