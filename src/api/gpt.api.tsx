import axios, { AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
});

export const getRoles = async () => {
  try {
    const response = await axiosInstance.get<void, AxiosResponse<string[]>>(
      '/roles'
    );
    return response;
  } catch {
    return undefined;
  }
};

export const getChat = async (search: string, role: string) => {
  try {
    const response = await axiosInstance.get<
      void,
      AxiosResponse<{ translatedText: string }>
    >(`/gpt?text=${search}&userRole=${role}`);
    return response;
  } catch {
    return undefined;
  }
};

export const getChats = async () => {
  try {
    const response = await axiosInstance.get<
      void,
      AxiosResponse<
        { requestText: string; answeredText: string; userRole: string }[]
      >
    >('/requests');
    return response;
  } catch {
    return undefined;
  }
};
