import api from "./api";
import { Post } from "../types/User";

export const postService = {
  async getPosts(): Promise<Post[]> {
    const response = await api.get("/posts");
    return response.data;
  },

  async createPost(content: string, image?: string): Promise<Post> {
    try {
      const userData = localStorage.getItem("user");
      
      if (!userData) {
        throw new Error("User not logged in");
      }

      const user = JSON.parse(userData);
      
      if (!user || !user.id) {
        throw new Error("User ID not found");
      }

      const postData = {
        content,
        image: image || null,
        authorId: user.id
      };

      console.log("Creating post with data:", postData);

      const response = await api.post("/posts", postData);
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  async likePost(postId: string): Promise<Post> {
    try {
      const userData = localStorage.getItem("user");
      
      if (!userData) {
        throw new Error("User not logged in");
      }

      const user = JSON.parse(userData);
      
      const response = await api.patch(`/posts/${postId}/like`, { 
        userId: user.id 
      });
      
      return response.data;
    } catch (error) {
      console.error("Error liking post:", error);
      throw error;
    }
  },

  async addComment(postId: string, content: string): Promise<Post> {
    const userData = localStorage.getItem("user");
    
    if (!userData) {
      throw new Error("User not logged in");
    }

    const user = JSON.parse(userData);
    
    const response = await api.post(`/posts/${postId}/comments`, { 
      content,
      authorId: user.id 
    });
    
    return response.data;
  },

  async deletePost(postId: string): Promise<void> {
    await api.delete(`/posts/${postId}`);
  }
};
