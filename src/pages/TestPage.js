import React from 'react'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
// import HomeIcon from '@material-ui/icons/Home';
// import Toolbar from '../components/Toolbar';
// import MapIcon from '@material-ui/icons/Map';
import MenuIcon from '@material-ui/icons/Menu';
import Draggable from 'react-draggable';

import useFitText from "use-fit-text";

// import { EditText, EditTextarea } from 'react-edit-text';
import 'react-edit-text/dist/index.css';


const TestPage = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "green",
            }}
        >
            <TestBox/>
            {/* <Grid container direction="row" justify="center" alignItems="center">
                <Grid item>
                    <Toolbar/>
                </Grid>
                <Grid item>
                    <TestBox/>
                </Grid>
            </Grid> */}
        </div>
    )
}

const TestBox = () => {
    const { fontSize, ref } = useFitText({maxFontSize:500});

    return (
        // Card
        // <div>
        // <Paper style={{ height: 100, width: 100 }}>
        //     <Grid container 
        //         direction="column" 
        //         justify="space-around"
        //         alignItems="center"
        //         style={{
        //             height: "100%", 
        //             width: "100%" 
        //         }}
        //     >
                // {/* Title */}
                // <Grid item 
                //     style={{
                //         height: "70%", 
                //         width: "95%", 
                //         textAlign: "center", 
                //     }}
                // >
                //     <Paper elevation="0" 
                //         ref={ref} 
                //         style={{ 
                //             fontSize, 
                //             height: "100%", 
                //             width: "100%", 
                //             fontWeight: "bold", 
                //             border: "1px outset",
                //             paddingLeft: "1",
                //             paddingRight: "5",
                //             textAlign: "center" 
                //         }} 
                //         onClick={() => {alert("clicked")}}
                //     >
                //         Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                //     </Paper>
                // </Grid>

                // {/* Expand */}
        //         <Grid item>
        //             <MenuIcon fontSize="small"/>
        //         </Grid>

        //     </Grid>
        // </Paper>



        <Draggable 
            bounds="parent"
            // defaultPosition={initialPos}
            >
                <Paper 
                // className={classes.root}
                style={{
                    position: "absolute",
                    height: 100, 
                    width: 100,
                }}

                // onMouseOver={() => handleMouseOver(id)}
                // onMouseOut={() => handleMouseLeave(id)}
                // onContextMenu={() => handleCardRClick(id)}
                >
                    <Grid container 
                        direction="column" 
                        justify="space-around"
                        alignItems="center"
                        style={{
                            height: "100%", 
                            width: "100%" 
                        }}
                    >
                        {/* Title */}
                        <Grid item 
                            style={{
                                height: "70%", 
                                width: "95%", 
                                textAlign: "center", 
                            }}
                        >
                            <Paper elevation="0" 
                                ref={ref} 
                                style={{ 
                                    fontSize, 
                                    height: "100%", 
                                    width: "100%", 
                                    fontWeight: "bold", 
                                    border: "1px outset",
                                    paddingLeft: "1",
                                    paddingRight: "5",
                                    textAlign: "center" 
                                }} 
                                onClick={() => {console.log("clicked")}}
                            >
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            </Paper>
                        </Grid>

                        {/* Expand */}
                        <Grid item>
                            <MenuIcon fontSize="small"/>
                        </Grid>
                    </Grid>
                </Paper>
            </Draggable>
        // </div>
    )
}


        // <Paper ref={ref} style={{ fontSize, height: 100, width: 200, padding:"15px" }}>
        //     Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        //     {/* <div ref={ref} style={{ fontSize, height: 100, width: 500 }}>
        //         Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        //     </div> */}
        // </Paper>


export default TestPage
