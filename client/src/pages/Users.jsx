import { Box } from "@mui/material";
import { useState } from "react";
import PageHeader from "../components/shared/PageHeader.jsx";
import UsersTable from "../components/users_comp/UsersTable.jsx";
import UserModal from "../components/users_comp/UserModal.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../api/users_api/createUser.js";
import { toast } from "sonner";
import { toggleUserStatus } from "../api/users_api/toggleUserStatus.js";
import updateUser from "../api/users_api/updateUser.js";
import resetPassword from "../api/users_api/resetPassword.js";

function Users() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const queryClient = useQueryClient();
  const [isResetMode, setIsResetMode] = useState(false);

  const { mutateAsync: createUserAsync } = useMutation({
    mutationFn: (userData) => createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const { mutateAsync: toggleUserStatusAsync } = useMutation({
    mutationFn: (data) => toggleUserStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const { mutateAsync: updateUserAsync } = useMutation({
    mutationFn: (userData) => updateUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const { mutateAsync: resetPasswordAsync } = useMutation({
    mutationFn: (userData) => resetPassword(userData),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  //handlers
  const handleAddUser = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsResetMode(false);
    setModalOpen(true);
  };

  const handleResetPassword = (user) => {
    setEditingUser(user);
    setIsResetMode(true);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingUser(null);
    setIsResetMode(false);
  };

  const handleSaveUser = (userData) => {
    if (isResetMode) {
      // TODO: Implement reset password logic
      toast.promise(resetPasswordAsync(userData), {
        loading: "Resetting password...",
        success: (data) => {
          setModalOpen(false);
          return "Password reset successfully";
        },
        error: (error) => {
          return error?.response?.data?.message || "Failed to reset password";
        },
      });
      return;
    }
    if (editingUser) {
      toast.promise(updateUserAsync(userData), {
        loading: "Updating user...",
        success: (data) => {
          setModalOpen(false);
          return "User updated successfully";
        },
        error: (error) => {
          console.log(error.message, "error");
          return "Failed to update user";
        },
      });
    } else {
      toast.promise(createUserAsync(userData), {
        loading: "Saving user...",
        success: (data) => {
          setModalOpen(false);
          return "User saved successfully";
        },
        error: (error) => {
          return error?.response?.data?.message || "Failed to save user";
        },
      });
    }
  };

  const handleToggleStatus = (user) => {
    // TODO: Implement toggle status logic
    const data = {
      userId: user.id,
      isActive: !user.isActive,
    };
    toast.promise(toggleUserStatusAsync(data), {
      loading: "Toggling user status...",
      success: (data) => {
        return "User status toggled successfully";
      },
      error: (error) => {
        const message = error?.response?.data?.message;

        return message || "Failed to toggle user status";
      },
    });
  };

  return (
    <Box>
      <PageHeader title="Users" btnText="Add User" onBtnClick={handleAddUser} />

      <UsersTable
        onEditUser={handleEditUser}
        onResetPassword={handleResetPassword}
        onToggleStatus={handleToggleStatus}
      />

      <UserModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        initialData={editingUser}
        isResetMode={isResetMode}
      />
    </Box>
  );
}

export default Users;
