import useSWR from 'swr';

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  author: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface BlogData {
  posts: Post[];
  pagination: Pagination;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useBlogData(page: number = 1, search: string = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '10'
  });

  if (search) {
    params.append('search', search);
  }

  const { data, error, isLoading, mutate } = useSWR<BlogData>(
    `/api/posts?${params.toString()}`,
    fetcher,
    {
      // Keep data in cache for 5 minutes
      dedupingInterval: 5 * 60 * 1000,
      // Revalidate on focus (when user comes back to tab)
      revalidateOnFocus: false,
      // Revalidate on reconnect (when internet comes back)
      revalidateOnReconnect: true,
      // Keep previous data while loading new data
      keepPreviousData: true,
    }
  );

  return {
    posts: data?.posts || [],
    pagination: data?.pagination || null,
    isLoading,
    error,
    mutate,
    // Check if we have cached data
    hasCachedData: !!data,
  };
}

// Hook for individual blog post
export function useBlogPost(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/posts/${id}` : null,
    fetcher,
    {
      dedupingInterval: 10 * 60 * 1000, // 10 minutes for individual posts
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      keepPreviousData: true,
    }
  );

  return {
    post: data?.post || null,
    isLoading,
    error,
    mutate,
    hasCachedData: !!data,
  };
}
