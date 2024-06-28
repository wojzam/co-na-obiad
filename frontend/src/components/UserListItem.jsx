import { ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { blue } from "@mui/material/colors";

export const UserListItem = ({ username }) => {
  return (
    <>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
          <PersonIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={username} />
    </>
  );
};
