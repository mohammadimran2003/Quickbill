import { Box } from "@mui/material";
import { useState } from "react";
import PageHeader from "../components/shared/PageHeader";
import UsersTable from "../components/users_comp/UsersTable";
import UserModal from "../components/users_comp/UserModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../api/users_api/createUser";
import { toast } from "sonner";
import { toggleUserStatus } from "../api/users_api/toggleUserStatus";

function Users() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const queryClient = useQueryClient();

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
    onError: (error) => {
      console.log(error);
    },
  });

  //handlers
  const handleAddUser = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = (userData) => {
    toast.promise(createUserAsync(userData), {
      loading: "Saving user...",
      success: (data) => {
        console.log(data);
        setModalOpen(false);
        return "User saved successfully";
      },
      error: (error) => {
        console.log(error);
        return "Failed to save user";
      },
    });
  };

  const handleResetPassword = (user) => {
    // TODO: Implement reset password logic
    console.log("Reset password for:", user);
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
        return "Failed to toggle user status";
      },
    });
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", p: 3 }}>
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
      />
    </Box>
  );
}

export default Users;
