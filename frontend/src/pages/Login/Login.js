import { React, useState, useContext } from 'react';
import LoadingScreen from "react-loading-screen";
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LoginIcon from '@mui/icons-material/Login';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AuthContext from "../../context/AuthContext";
import Cookies from "universal-cookie";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const cookies = new Cookies();
  let { user_id_exists, loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);

    // Obtener token CSRF de las cookies
    const csrfToken = document.cookie.match(/csrftoken=([^;]*)/)?.[1];

    let response = await fetch('http://localhost:8000/api/auth/login/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken // Añadir token CSRF al encabezado
      },
      body: JSON.stringify({ username: data.get('username'), password: data.get('password') }),
    });

    let responseJson = await response.json();
    if (responseJson.status === "Login failed") {
      alert("Incorrect Username/Password Combination");
      setLoading(false);
    } else {
      cookies.set("user_id", responseJson['user_id'], { path: "/", maxAge: 24 * 60 * 60 });
      alert("Login Succeeded");
      setLoading(false);
      navigate('/two-fa-verify-page');
    }
  };

  return (
    <LoadingScreen
      loading={loading}
      spinnerColor="#AC3B61"
      textColor="#AC3B61"
      text="Please Wait"
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'transparent', width: 80, height: 80 }}>
            <LoginIcon sx={{ color: 'green', fontSize: 80 }} />
          </Avatar>
          <Typography component="h1" variant="h5">
            Inicio de sesión
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <div>
              <img src="http://example.com/no-permitido.png" alt="Test Image" />
              <script src="https://cdn.no-permitido.com/script.js"></script>
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Envíar
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"¿No tienes una cuenta? Registrate aqui"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </LoadingScreen>
  );
}
