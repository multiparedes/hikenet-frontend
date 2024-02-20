type UseApiType = typeof useFetch;

export const useApi: UseApiType = (path: string, options: any = {}) => {
  const config = useRuntimeConfig();

  options.baseURL = config.public.apiPath as string;
  return useFetch(path, options);
};
