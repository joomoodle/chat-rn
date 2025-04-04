import apisauce, {ApisauceInstance, ApiResponse} from 'apisauce';
import {RootState, store} from '../redux/store';
// import { API_URL } from '@env';

const BASE_URL: string = '';
interface ApiService {
  post<T>(endpoint: string, data: T): Promise<ApiResponse<T>>;
  get<T>(endpoint: string): Promise<ApiResponse<T>>;
  put<T>(endpoint: string, data: T): Promise<ApiResponse<T>>;
  setHeaderForm(): void;
  removeHeaderForm(): void;
  setToken(token?: string): void;
  removeToken(): void;
}

const getJwtToken = (): string | undefined => {
  const state: RootState = store.getState();
  return state.user?.jwtToken ?? '';
};

const create = (endpoint = BASE_URL): ApiService => {
  const api: ApisauceInstance = apisauce.create({
    baseURL: endpoint,
    timeout: 962000,
  });

  api.addRequestTransform((request: any) => {
    const jwt = getJwtToken();
    if (jwt && !request.url.includes('users/register-user')) {
      //@ts-ignore
      request.headers.Authorization = `Bearer ${jwt}`;
    }
  });
  const post = <T>(endpoint: string, data: T) => api.post<T>(endpoint, data);
  const get = <T>(endpoint: string) => api.get<T>(endpoint);
  const put = <T>(endpoint: string, data: T) => api.put<T>(endpoint, data);

  const setHeaderForm = async () => {
    api.setHeader('Content-Type', 'Multipart/form-data');
  };

  const setToken = (token?: string) => {
    const jwt = token || getJwtToken();
    if (jwt) {
      api.setHeader('Authorization', `Bearer ${jwt}`);
    }
  };

  const removeHeaderForm = () => {
    api.deleteHeader('Content-Type');
  };

  const removeToken = () => {
    api.deleteHeader('Authorization');
  };

  return {
    post,
    get,
    put,
    removeHeaderForm,
    setHeaderForm,
    setToken,
    removeToken,
  };
};

const service = create();

export default service;
