// authStorage에서 데이터를 불러오고, 데이터가 존재하면 UserContext 업데이트 및 토큰을 적용
import {useEffect} from 'react';
import {useUserState} from '../contexts/UserContext';
import authStorage from '../storages/authStorage';
import {applyToken} from '../api/client';

export default function useAuthLoadEffect() {
  const [, setUser] = useUserState();

  useEffect(() => {
    /* useEffect 내부의 콜백함수는 async를 사용할 수 없으므로
    내부에 async 함수를 선언하고 해당함수를 호출 */
    const fn = async () => {
      const auth = await authStorage.get();
      if (!auth) {
        return;
      }
      setUser(auth.user);
      applyToken(auth.jwt);
    };
    fn();
  }, [setUser]);
}
