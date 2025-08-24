import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Hook for fetching posts with pagination and search
export function usePosts(page: number = 1, limit: number = 10, search?: string, author?: string) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (search) {
    params.append('search', search);
  }

  if (author) {
    params.append('author', author);
  }

  const { data, error, isLoading, mutate } = useSWR(
    `/api/posts?${params.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
      keepPreviousData: true,
      compare: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    }
  );

  return {
    posts: data?.posts || [],
    pagination: data?.pagination || null,
    isLoading,
    error,
    mutate
  };
}

// Hook for fetching authors
export function useAuthors() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/users',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
      keepPreviousData: true,
      compare: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    }
  );

  return {
    authors: data?.users || [],
    isLoading,
    error,
    mutate
  };
}

// Hook for fetching a single post
export function usePost(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/posts/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes for posts
      keepPreviousData: true,
      compare: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    }
  );

  return {
    post: data?.post || null,
    isLoading,
    error,
    mutate
  };
}

// Hook for fetching user's posts
export function useMyPosts() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/posts/my-posts',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 120000, // 2 minutes
      keepPreviousData: true,
      compare: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    }
  );

  return {
    posts: data?.posts || [],
    isLoading,
    error,
    mutate
  };
}
