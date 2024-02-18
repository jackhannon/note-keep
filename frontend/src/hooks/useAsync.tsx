import { useCallback, useState } from "react";

type AsyncFunction<T> = (...args: never[]) => Promise<T>;


export function useAsyncFn<T>(
  func: AsyncFunction<T>,
  dependencies: React.DependencyList = []
) {
  return useAsyncInternal<T>(func, dependencies, false);
}

function useAsyncInternal<T>(
  func: AsyncFunction<T>,
  dependencies: React.DependencyList = [],
  initialLoading = false
) {
  
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState<T>();

  const execute = useCallback((...params) => {
    setLoading(true);

    return func(...params)
      .then((data: T) => {
        console.log(data)
        setData(data);
        setLoading(false);
        return data
      },
      (error: Error) => {
        setError(error);
        console.log(error)
        setData(undefined);
        setLoading(false);
        return Promise.reject();
      })
      .finally(() => {
        setLoading(false);
      });
  }, dependencies);
  return { execute, loading, error, data };
}