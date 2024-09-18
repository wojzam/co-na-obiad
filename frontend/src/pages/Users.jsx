import React, {useEffect, useState} from "react";
import {
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import useAuthAxios from "../hooks/useAuthAxios";
import MessageBox from "../components/MessageBox";

const Users = () => {
    const axiosInstance = useAuthAxios();
    const [users, setUsers] = useState([]);
    const [isPending, setIsPending] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        axiosInstance.get("/api/users")
            .then((response) => {
                setUsers(response.data);
                setIsPending(false);
            })
            .catch(() => {
                setErrorMessage("Error fetching users");
                setIsPending(false);
            });
    }, []);

    const handleChangeActiveStatus = (userId) => {
        const updatedUsers = users.map((user) =>
            user._id === userId ? {...user, active: !user.active} : user
        );
        setUsers(updatedUsers);

        axiosInstance.put(`/api/users/${userId}/status`, {active: !users.find(u => u._id === userId).active})
            .catch(() => setErrorMessage("Error updating user status"));
    };

    const handleOpenDialog = (user) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        axiosInstance.put(`/api/users/${selectedUser._id}/reset-password`, {newPassword: newPassword})
            .then(() => {
                handleCloseDialog();
            })
            .catch(() => setErrorMessage("Error changing password"));
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <Typography component="h1" variant="h3" fontWeight="medium" gutterBottom>
                Użytkownicy
            </Typography>
            <MessageBox message={errorMessage} isError={true}/>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nazwa</TableCell>
                            <TableCell align="right">Aktywny</TableCell>
                            <TableCell align="right">Przepisy</TableCell>
                            <TableCell align="right">Akcje</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                            <TableRow
                                key={user._id}
                                sx={{
                                    backgroundColor:
                                        index % 2 === 0
                                            ? theme.palette.neutral.main
                                            : theme.palette.neutral.darker,
                                }}
                            >
                                <TableCell>{user.username}</TableCell>
                                <TableCell align="right">
                                    <Checkbox
                                        checked={user.active}
                                        onChange={() => handleChangeActiveStatus(user._id)}
                                        color="primary"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    {user.recipeCount}
                                </TableCell>
                                <TableCell align="right">
                                    <Button variant="outlined" onClick={() => handleOpenDialog(user)}>
                                        Resetuj hasło
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={users.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {isPending && <CircularProgress/>}

            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Resetuj hasło dla {selectedUser?.username}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Podaj nowe hasło:
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        label="Nowe hasło"
                        type="password"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Powtórz hasło"
                        type="password"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Anuluj
                    </Button>
                    <Button onClick={handleChangePassword} color="primary">
                        Zatwierdź
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Users;
