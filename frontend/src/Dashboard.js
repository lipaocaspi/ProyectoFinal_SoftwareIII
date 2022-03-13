import React, { Component } from 'react';
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
const axios = require('axios');

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openRideModal: false,
      openRideEditModal: false,
      id: '',
      route: '',
      plaque: '',
      price: '',
      room: '',
      file: '',
      fileName: '',
      page: 1,
      search: '',
      rides: [],
      pages: 0,
      loading: false
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/login');
    } else {
      this.setState({ token: token }, () => {
        this.getRide();
      });
    }
  }

  getRide = () => {
    
    this.setState({ loading: true });

    let data = '?';
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }
    axios.get(`http://localhost:2000/get-ride${data}`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, rides: res.data.rides, pages: res.data.pages });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false, rides: [], pages: 0 },()=>{});
    });
  }

  deleteRide = (id) => {
    axios.post('http://localhost:2000/delete-ride', {
      id: id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.setState({ page: 1 }, () => {
        this.pageChange(null, 1);
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  }

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getRide();
    });
  }

  logOut = () => {
    localStorage.setItem('token', null);
    this.props.history.push('/');
  }

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name }, () => { });
    }
    this.setState({ [e.target.name]: e.target.value }, () => { });
    if (e.target.name == 'search') {
      this.setState({ page: 1 }, () => {
        this.getRide();
      });
    }
  };

  addRide = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('file', fileInput.files[0]);
    file.append('route', this.state.route);
    file.append('plaque', this.state.plaque);
    file.append('price', this.state.price);
    file.append('room', this.state.room);

    axios.post('http://localhost:2000/add-ride', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleRideClose();
      this.setState({ route: '', plaque: '', price: '', room: '', file: null, page: 1 }, () => {
        this.getRide();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleRideClose();
    });

  }

  updateRide = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('id', this.state.id);
    file.append('file', fileInput.files[0]);
    file.append('route', this.state.route);
    file.append('plaque', this.state.plaque);
    file.append('price', this.state.price);
    file.append('room', this.state.room);

    axios.post('http://localhost:2000/update-ride', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleRideEditClose();
      this.setState({ route: '', plaque: '', price: '', room: '', file: null }, () => {
        this.getRide();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleRideEditClose();
    });

  }

  handleRideOpen = () => {
    this.setState({
      openRideModal: true,
      id: '',
      route: '',
      plaque: '',
      price: '',
      room: '',
      fileName: ''
    });
  };

  handleRideClose = () => {
    this.setState({ openRideModal: false });
  };

  handleRideEditOpen = (data) => {
    this.setState({
      openRideEditModal: true,
      id: data._id,
      route: data.route,
      plaque: data.plaque,
      price: data.price,
      room: data.room,
      fileName: data.image
    });
  };

  handleRideEditClose = () => {
    this.setState({ openRideEditModal: false });
  };

  render() {
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div>
          <h2>Dashboard</h2>
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleRideOpen}
          >
            Add Ride
          </Button>
          <Button
            className="button_style"
            variant="contained"
            size="small"
            onClick={this.logOut}
          >
            Log Out
          </Button>
        </div>

        {/* Edit Ride */}
        <Dialog
          open={this.state.openRideEditModal}
          onClose={this.handleRideClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Edit Ride</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="route"
              value={this.state.route}
              onChange={this.onChange}
              placeholder="Route"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="plaque"
              value={this.state.plaque}
              onChange={this.onChange}
              placeholder="Plaque"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="price"
              value={this.state.price}
              onChange={this.onChange}
              placeholder="Price"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="room"
              value={this.state.room}
              onChange={this.onChange}
              placeholder="Room"
              required
            /><br /><br />
            <Button
              variant="contained"
              component="label"
            > Upload
            <input
                id="standard-basic"
                type="file"
                accept="image/*"
                name="file"
                value={this.state.file}
                onChange={this.onChange}
                id="fileInput"
                placeholder="File"
                hidden
              />
            </Button>&nbsp;
            {this.state.fileName}
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleRideEditClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.route == '' || this.state.plaque == '' || this.state.price == '' || this.state.room == ''}
              onClick={(e) => this.updateRide()} color="primary" autoFocus>
              Edit Ride
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Ride */}
        <Dialog
          open={this.state.openRideModal}
          onClose={this.handleRideClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Add Ride</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="route"
              value={this.state.route}
              onChange={this.onChange}
              placeholder="Route"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="plaque"
              value={this.state.plaque}
              onChange={this.onChange}
              placeholder="Plaque"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="price"
              value={this.state.price}
              onChange={this.onChange}
              placeholder="Price"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="room"
              value={this.state.room}
              onChange={this.onChange}
              placeholder="Room"
              required
            /><br /><br />
            <Button
              variant="contained"
              component="label"
            > Upload
            <input
                id="standard-basic"
                type="file"
                accept="image/*"
                // inputProps={{
                //   accept: "image/*"
                // }}
                name="file"
                value={this.state.file}
                onChange={this.onChange}
                id="fileInput"
                placeholder="File"
                hidden
                required
              />
            </Button>&nbsp;
            {this.state.fileName}
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleRideClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.route == '' || this.state.plaque == '' || this.state.price == '' || this.state.room == '' || this.state.file == null}
              onClick={(e) => this.addRide()} color="primary" autoFocus>
              Add Ride
            </Button>
          </DialogActions>
        </Dialog>

        <br />

        <TableContainer>
          <TextField
            id="standard-basic"
            type="search"
            autoComplete="off"
            name="search"
            value={this.state.search}
            onChange={this.onChange}
            placeholder="Search by Route"
            required
          />
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Route</TableCell>
                <TableCell align="center">Model</TableCell>
                <TableCell align="center">Plaque</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Room</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.rides.map((row) => (
                <TableRow key={row.route}>
                  <TableCell align="center" component="th" scope="row">
                    {row.route}
                  </TableCell>
                  <TableCell align="center"><img src={`http://localhost:2000/${row.image}`} width="70" height="70" /></TableCell>
                  <TableCell align="center">{row.plaque}</TableCell>
                  <TableCell align="center">{row.price}</TableCell>
                  <TableCell align="center">{row.room}</TableCell>
                  <TableCell align="center">
                    <Button
                      className="button_style"
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={(e) => this.handleRideEditOpen(row)}
                    >
                      Edit
                  </Button>
                    <Button
                      className="button_style"
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={(e) => this.deleteRide(row._id)}
                    >
                      Delete
                  </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <br />
          <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChange} color="primary" />
        </TableContainer>

      </div>
    );
  }
}
