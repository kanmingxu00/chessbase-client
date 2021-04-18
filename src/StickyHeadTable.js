import React, { Component } from "react";

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const columns = [
    { id: 'Game', label: 'Game', minWidth: 130 },
    { id: 'Player1', label: 'Player\u00a01', minWidth: 100 },
    { id: 'Player2', label: 'Player\u00a02', minWidth: 100 },
    { id: 'Player1Rank', label: 'Player\u00a01\u00a0Rank', minWidth: 100 },
    { id: 'Player2Rank', label: 'Player\u00a02\u00a0Rank', minWidth: 100 },
    { id: 'Winner', label: 'Winner', minWidth: 100 },
    { id: 'TimeControl', label: 'Time\u00a0Control', minWidth: 100 },
  ];





export default class StickyHeadTable extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            rows: this.props.rows,
            page: 0,
            rowsPerPage: 7,
        };
        this.classes = makeStyles({
            root: {
                width: '100%',
            },
            container: {
                maxHeight: 200,
            },
        });
    }

    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage
        })
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({
            rowsPerPage: +event.target.value,
            page: 0,
        })
    };
    render() {
        return (
                <Paper className={this.classes.root}>
                    <TableContainer className={this.classes.container}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.rows.slice(this.state.page * this.state.rowsPerPage, 
                                this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[7, 10, 15]}
                        component="div"
                        count={this.state.rows.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </Paper>
            );
    }
    
}