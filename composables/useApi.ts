type UseApiType = typeof useFetch;

export const useApi: UseApiType = (path: string, options: any = {}) => {
  const config = useRuntimeConfig();

  options.baseURL = config.public.apiPath as string;
  options.credentials = "include";

  return useFetch(path, options);
};
