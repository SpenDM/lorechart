import React from 'react'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import HomeIcon from '@material-ui/icons/Home';
import Toolbar from '../components/Toolbar';

const TestPage = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "green",
            }}
        >
            <Grid container direction="row" justify="center" alignItems="center">
                <Grid item>
                    <Toolbar/>
                </Grid>
                <Grid item>
                    <HomeIcon/>
                </Grid>
            </Grid>
        </div>
    )
}

export default TestPage
