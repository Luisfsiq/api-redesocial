import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { People, PostAdd, TrendingUp } from "@mui/icons-material";
import { userService } from "../../services/userService";
import { postService } from "../../services/postService";
import { User, Post } from "../../types/User";

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, postsData] = await Promise.all([
          userService.getUsers(),
          postService.getPosts()
        ]);
        setUsers(usersData);
        setPosts(postsData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  const postsToday = posts.filter(post => {
    const postDate = new Date(post.createdAt);
    const today = new Date();
    return postDate.toDateString() === today.toDateString();
  }).length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
                <Box>
                  <Typography variant="h6" color="textSecondary">
                    Total de Usuários
                  </Typography>
                  <Typography variant="h4">
                    {users.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PostAdd sx={{ fontSize: 40, color: "secondary.main", mr: 2 }} />
                <Box>
                  <Typography variant="h6" color="textSecondary">
                    Total de Posts
                  </Typography>
                  <Typography variant="h4">
                    {posts.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp sx={{ fontSize: 40, color: "success.main", mr: 2 }} />
                <Box>
                  <Typography variant="h6" color="textSecondary">
                    Posts Hoje
                  </Typography>
                  <Typography variant="h4">
                    {postsToday}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
