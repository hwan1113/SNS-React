import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import fetch from 'isomorphic-fetch';
import { generateFetchConfig } from '../../shared/http';
import axios from 'axios';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  video: {
    height: 100
  }
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const onChangeHandler = (event) => {
  const data = new FormData()
  data.append('file', event.target.files[0])
  axios.post("/osapi?func=upload", data)
    .then(res => { // then print response status
      console.log(res.statusText)
    })
}

export default function SimpleTable() {
  // var socket = io();
  const classes = useStyles();

  const rows = [
    createData(
      'Process',
      'POSIX API',
      <button onClick={handlePosix}>Posix api</button>,
      <input placeholder="uplaod auto" type="file" name="file" onChange={onChangeHandler} />,
      <video className={classes.video} id="videoPlayer" controls muted autoPlay src="/osapi?func=video_stream" />
    ),
    createData(
      'Process',
      'child_proc',
      <button onClick={handlechild_proc}>child_proc</button>,
      <input placeholder="uplaod auto" type="file" name="file" onChange={onChangeHandler} />,
      12
    ),
    createData(
      'Process',
      'socket',
      <button onClick={handleSocket}>Socket</button>,
      3,
      12
    )
  ];

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Chapter</TableCell>
            <TableCell align="right">function</TableCell>
            <TableCell align="right">input 1&nbsp;</TableCell>
            <TableCell align="right">input 2&nbsp;</TableCell>
            <TableCell align="right">result &nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const handlePosix = () => {
  return fetch(`/osapi/`,
    generateFetchConfig('POST', { chapter: "process", func: 'posix' })
  ).then((res) => {
    console.log(res)
  })
}
const handlechild_proc = () => {
  return fetch(`/osapi/`,
    generateFetchConfig('POST', { chapter: "process", func: 'child_proc' })
  ).then((res) => {
    console.log(res)
  })
}

const handleSocket = () => {
  socket.emit('date')
  socket.on('date', (data)=>{
    console.log(data.msg)

  })
}