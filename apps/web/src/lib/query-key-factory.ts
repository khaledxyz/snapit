export interface TQueryKey<
  TKey,
  TListQuery = Record<string, unknown>,
  TDetailQuery = string,
> {
  all: readonly [TKey];
  lists: () => readonly [TKey, "list"];
  list: (query: TListQuery) => readonly [TKey, "list", { query: TListQuery }];
  details: () => readonly [TKey, "detail"];
  detail: (
    id: TDetailQuery,
    query: TListQuery
  ) => readonly [TKey, "detail", TDetailQuery, { query: TListQuery }];
}

export const queryKeysFactory = <
  T,
  TListQueryType = Record<string, unknown>,
  TDetailQueryType = string,
>(
  globalKey: T
) => {
  const queryKeyFactory: TQueryKey<T, TListQueryType, TDetailQueryType> = {
    all: [globalKey],
    lists: () => [...queryKeyFactory.all, "list"] as const,
    list: (query: TListQueryType) =>
      [...queryKeyFactory.lists(), { query }] as const,
    details: () => [...queryKeyFactory.all, "detail"] as const,
    detail: (id: TDetailQueryType, query: TListQueryType) =>
      [...queryKeyFactory.details(), id, { query }] as const,
  };
  return queryKeyFactory;
};
