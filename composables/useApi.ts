const useApi = () => {
  const config = useRuntimeConfig();

  const makeRequest = (method: string, path: string, options: any = {}) => {
    const token = useCookie(`auth._token.cookie`).value;

    const requestOptions = {
      ...options,
      baseURL: config.public.apiPath as string,
      method: method.toUpperCase(),
      headers: {
        Authorization: token ?? "",
      },
    };

    return useFetch(path, requestOptions);
  };

  const get = (path: string, options: any = {}) => {
    return makeRequest("GET", path, options);
  };

  const post = (path: string, options: any = {}) => {
    return makeRequest("POST", path, options);
  };

  const patch = (path: string, options: any = {}) => {
    return makeRequest("PATCH", path, options);
  };

  return { get, post, patch };
};

export default useApi;
