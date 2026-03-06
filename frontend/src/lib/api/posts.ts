import apiClient from './client';

export interface Post {
  _id: string;
  authorId: {
    _id: string;
    firstName: string;
    lastName: string;
    displayName: string;
    avatar?: string;
    designation: string;
  };
  content: string;
  media?: Array<{
    type: string;
    url: string;
    thumbnail?: string;
  }>;
  tags?: string[];
  reactions: Array<{
    userId: string;
    type: string;
    createdAt: Date;
  }>;
  comments: Array<{
    _id: string;
    userId: {
      firstName: string;
      lastName: string;
      displayName: string;
      avatar?: string;
    };
    content: string;
    createdAt: Date;
  }>;
  engagement: {
    viewCount: number;
    reactionCount: number;
    commentCount: number;
    engagementScore: number;
  };
  createdAt: Date;
}

export const postsApi = {
  getPosts: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    sort?: string;
  }) => {
    const response = await apiClient.get('/posts', { params });
    return response.data;
  },

  getPost: async (id: string) => {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (data: {
    content: string;
    media?: File[];
    tags?: string[];
    visibility?: string;
  }) => {
    const formData = new FormData();
    formData.append('content', data.content);
    if (data.tags) {
      formData.append('tags', JSON.stringify(data.tags));
    }
    if (data.media) {
      data.media.forEach((file) => {
        formData.append('media', file);
      });
    }

    const response = await apiClient.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updatePost: async (id: string, data: { content?: string; tags?: string[] }) => {
    const response = await apiClient.put(`/posts/${id}`, data);
    return response.data;
  },

  deletePost: async (id: string) => {
    const response = await apiClient.delete(`/posts/${id}`);
    return response.data;
  },

  addReaction: async (id: string, type: string) => {
    const response = await apiClient.post(`/posts/${id}/react`, { type });
    return response.data;
  },

  removeReaction: async (id: string) => {
    const response = await apiClient.delete(`/posts/${id}/react`);
    return response.data;
  },

  addComment: async (id: string, content: string, parentId?: string) => {
    const response = await apiClient.post(`/posts/${id}/comments`, {
      content,
      parentId,
    });
    return response.data;
  },

  updateComment: async (postId: string, commentId: string, content: string) => {
    const response = await apiClient.put(`/posts/${postId}/comments/${commentId}`, {
      content,
    });
    return response.data;
  },

  deleteComment: async (postId: string, commentId: string) => {
    const response = await apiClient.delete(`/posts/${postId}/comments/${commentId}`);
    return response.data;
  },

  sharePost: async (id: string) => {
    const response = await apiClient.post(`/posts/${id}/share`);
    return response.data;
  },
};
