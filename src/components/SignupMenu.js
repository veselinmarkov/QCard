import React from 'react'
import {Popover, InputBase, Button} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({ 
    container: {
      display: "flex",
      gap: "10px",
      flexDirection: "column",
      padding: "15px",
      border: "2px solid #e34d7d", 
      borderRadius: "5px",
      backgroundColor: "#3f51b5",
      color: "#fff",
    },
    inputText: {
        backgroundColor: theme.palette.background.default
    }
}));

export function SignupMenu(props) { //open, anchor, handleSignup, handleClose
    const [firstName, setFirstName ] = React.useState("");
    const [lastName, setLastName ] = React.useState("");
    const [username, setUsername ] = React.useState("");
    const [password, setPassword ] = React.useState("");
    const classes = useStyles();
    //const open = Boolean(props.anchor);

    const handleSignup = () => {
        if (props.handleSignup)
            props.handleSignup(firstName, lastName, username, password, () => {
                setFirstName('');
                setLastName('');
                setUsername('');
                setPassword('');
            });
    }

    const handleClose = () => {
        if (props.handleClose)
            props.handleClose();
    }

    const handleFirstName = e => setFirstName(e.target.value);
    const handleLastName = e => setLastName(e.target.value);
    const handleUser = e => setUsername(e.target.value);
    const handlePassword = e => setPassword(e.target.value);
    return (
        <Popover
            id="popper"
            open={props.open}
            anchorEl={props.anchor}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }} >
                <div className={classes.container}>
                <InputBase className={classes.inputText} placeholder="FirstName"
                    onChange={handleFirstName} value={firstName}/>
                <InputBase className={classes.inputText} placeholder="LastName"
                    onChange={handleLastName} value={lastName}/>
                <InputBase className={classes.inputText} placeholder="User"
                    onChange={handleUser} value={username}/>
                <InputBase type={"password"} className={classes.inputText} 
                    placeholder="password" onChange={handlePassword} value={password}/>
                <Button onClick={handleSignup} variant="contained" color="primary">
                    Sign Up
                </Button>
                </div>
            </Popover>
    )
}