import React from 'react';
import Grid from '@material-ui/core/Grid';
import Toolbar from '../components/Toolbar';
import Canvas from '../components/Canvas';

import '../App.css';
import './CanvasPage.css';


const CanvasPage = () => {
    return (
        <Grid container>
            <Grid item xs={1}>
                <ToolbarSection/>
            </Grid>
            <Grid item xs={11}>
                <CanvasSection/>
            </Grid>
        </Grid>
    )
}


const ToolbarSection = () => {
    return (
        <div className="toolbarSection App-background"
            onContextMenu={(e) => {e.preventDefault();}}
            style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
            }}
        >
            <Toolbar/>
        </div>
    )
}


const CanvasSection = () => {
    return (
        <div 
            className="canvas App-background"
            onContextMenu={(e) => {e.preventDefault();}}
        >
            <Canvas/>
        </div>
    )
}


export default CanvasPage
