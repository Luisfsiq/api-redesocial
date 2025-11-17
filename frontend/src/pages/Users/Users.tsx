import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  CircularProgress,
} from "@mui/material";
import { userService } from "../../services/userService";
import { User } from "../../types/User";

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await userService.getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
        Usuários
      </Typography>

      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar
                  sx={{ width: 60, height: 60, margin: "0 auto 16px" }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {user.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {user.email}
                </Typography>
                {user.bio && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {user.bio}
                  </Typography>
                )}
                <Typography variant="caption" color="textSecondary">
                  Membro desde: {new Date(user.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Users;
