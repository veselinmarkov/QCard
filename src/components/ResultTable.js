import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';



export function ResultTable(props) {
    
    return (
        <TableContainer>
        <Table size="small" aria-label="a dense table" style={{minWidth: 450}}>
            <TableHead>
            <TableRow>
                <TableCell>Time</TableCell>
                <TableCell align="right" padding="none">German word</TableCell>
                <TableCell align="right" padding="none">English translate</TableCell>
                <TableCell align="right" padding="none">Answered</TableCell>
                <TableCell align="right" padding="none">Success</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {props.data.map((row) => (
                <TableRow key={row._id}>
                <TableCell>
                    {row._id}
                </TableCell>
                <TableCell align="right" padding="none">{row.word}</TableCell>
                <TableCell align="right" padding="none">{row.correct}</TableCell>
                <TableCell align="right" padding="none">{row.answer}</TableCell>
                <TableCell align="right" padding="none">{row.wasCorrect ? "True" : "False"}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    )
}