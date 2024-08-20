import React, { useEffect, useState } from "react";
import { useUserStore } from "../../app/userStore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const Users: React.FC = () => {
  const { loading, users, error, fetchUsers, addUser, updateUser, deleteUser } =
    useUserStore();

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    phone: "",
  });

  const [openModal, setOpenModal] = useState(false);
  const [editUser, setEditUser] = useState<{ id: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddOrUpdateUser = () => {
    if (editUser) {
      updateUser(editUser.id, newUser);
    } else {
      addUser(newUser);
    }
    resetUserForm();
    setOpenModal(false);
  };

  const resetUserForm = () => {
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      phone: "",
    });
    setEditUser(null);
  };

  const handleDeleteUser = (id: string) => {
    deleteUser(id);
    setDeleteConfirm(null);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  return (
    <div style={{ padding: "20px", overflowY: "auto" }}>
      <h2>Users</h2>
      {loading && <h2>Loading...</h2>}
      {error && <h2>{error}</h2>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setEditUser({ id: user.id });
                        setNewUser({
                          firstName: user.firstName,
                          lastName: user.lastName,
                          email: user.email,
                          username: user.username,
                          password: user.password,
                          phone: user.phone,
                        });
                        setOpenModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setDeleteConfirm(user.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "20px" }}
        onClick={() => setOpenModal(true)}
      >
        Add User
      </Button>

      <Pagination
        count={Math.ceil(users.length / rowsPerPage)}
        page={page}
        onChange={handlePageChange}
        style={{ marginTop: "20px" }}
      />

      {/* Add/Edit User Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>{editUser ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            value={newUser.firstName}
            onChange={(e) =>
              setNewUser({ ...newUser, firstName: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Last Name"
            value={newUser.lastName}
            onChange={(e) =>
              setNewUser({ ...newUser, lastName: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Username"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            type="password"
            fullWidth
            margin="dense"
          />
          <TextField
            label="Phone"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAddOrUpdateUser}
            color="primary"
            disabled={
              !(
                newUser.firstName &&
                newUser.lastName &&
                newUser.email &&
                newUser.username &&
                newUser.password &&
                newUser.phone
              )
            }
          >
            {editUser ? "Update User" : "Add User"}
          </Button>
        </DialogActions>
      </Dialog>

      {deleteConfirm && (
        <Dialog open={true} onClose={() => setDeleteConfirm(null)}>
          <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
          <DialogContent>
            <p>This action cannot be undone.</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirm(null)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteUser(deleteConfirm)}
              color="secondary"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Users;
