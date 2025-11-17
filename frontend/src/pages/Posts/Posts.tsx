import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  IconButton,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Favorite, FavoriteBorder, Comment } from "@mui/icons-material";
import { postService } from "../../services/postService";
import { useAuth } from "../../contexts/AuthContext";
import { Post } from "../../types/User";

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsData = await postService.getPosts();
      setPosts(postsData);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setPosting(true);
    try {
      await postService.createPost(newPost);
      setNewPost("");
      fetchPosts();
    } catch (error) {
      console.error("Erro ao criar post:", error);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await postService.likePost(postId);
      fetchPosts();
    } catch (error) {
      console.error("Erro ao curtir post:", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Posts
      </Typography>

      {/* Criar novo post */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box component="form" onSubmit={handleCreatePost}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="O que você está pensando?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={posting || !newPost.trim()}
            >
              {posting ? "Publicando..." : "Publicar"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Lista de posts */}
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ mr: 2 }}>
                    {post.author.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {post.author.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(post.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  {post.content}
                </Typography>

                <Box display="flex" alignItems="center" gap={2}>
                  <IconButton
                    onClick={() => handleLike(post.id)}
                    color={post.likes.includes(user?.id || "") ? "error" : "default"}
                  >
                    {post.likes.includes(user?.id || "") ? (
                      <Favorite />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                  <Typography variant="body2">
                    {post.likes.length} curtidas
                  </Typography>

                  <Comment sx={{ ml: 2 }} />
                  <Typography variant="body2">
                    {post.comments.length} comentários
                  </Typography>
                </Box>

                {/* Comentários */}
                {post.comments.length > 0 && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Comentários:
                    </Typography>
                    {post.comments.map((comment) => (
                      <Box key={comment.id} sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {comment.author.name}:
                        </Typography>
                        <Typography variant="body2">
                          {comment.content}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Posts;
