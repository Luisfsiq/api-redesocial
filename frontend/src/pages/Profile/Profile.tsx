import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Alert,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { userService } from "../../services/userService";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await userService.updateUser(user.id, { name, bio });
      setMessage("Perfil atualizado com sucesso!");
    } catch (error) {
      setMessage("Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Meu Perfil
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Avatar
              sx={{ width: 100, height: 100, margin: "0 auto 16px" }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6">{user?.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {user?.email}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Editar Perfil
            </Typography>

            {message && (
              <Alert severity={message.includes("sucesso") ? "success" : "error"} sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                margin="normal"
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                label="Email"
                value={user?.email}
                margin="normal"
                disabled
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
