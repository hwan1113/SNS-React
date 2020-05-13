import React from 'react';
import simpleTable from '../components/table/simpleTable';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

export default function OS() {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        OS-Concepts
                    </Typography>
                </Toolbar>
            </AppBar>
            {simpleTable()}
        </div>
    );
}