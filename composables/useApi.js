export const useApi = (path, options = {}) => {
  const config = useRuntimeConfig();

  options.baseURL = config.public.apiPath;
  options.credentials = "include";
  return useFetch(path, options);
};
