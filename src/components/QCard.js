import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';

// props: result, language, word, difficulty
export default function QCard(props) {
    const [answer, setAnswer] = React.useState("");

    const handleCancel = () =>{
        //console.log('Answer:' +answer);
        if (props.result)
            props.result();
    }

    const handleConfirm = () => {
        //console.log('Answer:' +answer);
        if (props.result) {
            props.result(answer);
        }
    }

    const changeHandle = (e) => {
        setAnswer(e.target.value);
    }

    useEffect(()=> {
        //console.log('answer before clearing:' +answer);
        setAnswer('');
    }, [props.word]);

    return (
        <Dialog open={props.open} onClose={handleCancel} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Translate the word in {props.language}</DialogTitle>
            <DialogContent>
            <DialogContentText>
                <Typography component="h2" color="secondary">
                    {props.difficulty}          
                </Typography>
            </DialogContentText>
            <DialogContentText>
                <Typography component="h1" id="word">
                    {props.word}          
                </Typography>
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="answer"
                label="translate"
                fullWidth
                onChange={changeHandle}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleCancel} color="primary">
                Cancel
            </Button>
            <Button onClick={handleConfirm} color="primary">
                Confirm
            </Button>
            </DialogActions>
        </Dialog>
    )
}