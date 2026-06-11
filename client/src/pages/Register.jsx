import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validations/authValidation.js";
import registerUser from "../api/auth/registerUser.js";
import { useNavigate } from "react-router-dom";

function Register() {
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "SALESMAN",
    },
  });

  const onSubmit = async (data) => {
    toast.promise(registerUser(data), {
      loading: "Registering user...",
      success: (data) => {
        navigate("/dashboard");

        return `Registration successful! Welcome ${data.user.name || "to QuickBill"}`;
      },
      error: (err) => {
        return err.message || "Registration failed. Please try again.";
      },
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1100,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        boxShadow:
          "0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)",
        borderRadius: 3,
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          flex: 1,
          p: { xs: 4, md: 6 },
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText || "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Inventory2Icon sx={{ fontSize: 42 }} />
          <Typography variant="h4" fontWeight={700}>
            QuickBill
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight={700} mb={2}>
          Create your account
        </Typography>
        <Typography sx={{ opacity: 0.9, lineHeight: 1.8 }}>
          Join the team and manage products, orders, and sales with a secure
          admin portal. Select the right role and start using your dashboard in
          minutes.
        </Typography>
      </Box>

      {/* Form Section */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 4, md: 6 },
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          color="text.primary"
          sx={{ mb: 2 }}
        >
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "grid",
            gap: 2.5,
          }}
        >
          <TextField
            label="Name"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
          />
          <TextField
            label="Confirm Password"
            type="password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            fullWidth
          />

          <FormControl fullWidth error={!!errors.role}>
            <InputLabel id="role-label">Role</InputLabel>
            <Controller
              name="role"
              control={control}
              defaultValue="SALESMAN"
              render={({ field }) => (
                <Select {...field} labelId="role-label" label="Role">
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="MANAGER">Manager</MenuItem>
                  <MenuItem value="SALESMAN">Salesman</MenuItem>
                </Select>
              )}
            />
            {errors.role && (
              <FormHelperText>{errors.role.message}</FormHelperText>
            )}
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              mt: 1,
              py: 1.5,
              fontWeight: "bold",
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
            disabled={isSubmitting}
          >
            Create account
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Register;
