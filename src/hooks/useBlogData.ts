import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Hook for fetching posts with pagination and search
export function usePosts(page: number = 1, limit: number = 10, search?: string) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (search) {
    params.append('search', search);
  }

  const { data, error, isLoading, mutate } = useSWR(
    `/api/posts?${params.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // 10 seconds
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

// Hook for fetching a single post
export function usePost(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/posts/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30 seconds for posts
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
      revalidateOnReconnect: true,
      dedupingInterval: 15000, // 15 seconds
    }
  );

  return {
    posts: data?.posts || [],
    isLoading,
    error,
    mutate
  };
}
