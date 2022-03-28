import React from 'react'
import '../App.css';
import './MainPage.css'
import Grid from '@material-ui/core/Grid'
import MenuButton from '../components/MenuButton'
import Public from '@material-ui/icons/Public';


const MainPage = () => {
    return (
        <div className="App">
        <header className="App-main App-background">
            <Grid container spacing={0} justify="center" alignItems="center">
                
                {/* Left side items */}
                <Grid item xs={6} md={4} container spacing={3} 
                    alignItems="center"
                    justify="center">
                    <Grid item xs={12}>
                        <h1>LORE CHART</h1>
                    </Grid>
                    <Grid item xs={12}>
                        <Public fontSize="large"/>
                    </Grid>
                    <Grid item xs={12}>
                        <p>Plan RPG Campaigns</p>
                    </Grid>
                </Grid>

                {/* Right side items */}
                <Grid item xs={6} md={3}>
                    <Grid container spacing={1} justify="center" alignItems="center">
                        <Grid item>
                            <MenuButton url="/storyboard" buttonText="Create Story"/>
                        </Grid>
                        <Grid item>
                            <MenuButton url="/storyboard" buttonText="Load Story"/>
                            {/* <div>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    style={{maxWidth: '200px', maxHeight: '100px', minWidth: '200px', minHeight: '40px'}}
                                >
                                    Load Story
                                </Button>
                            </div> */}
                        </Grid>
                        <Grid item>
                            <MenuButton url="/storyboard" buttonText="Tutorial"/>
                        </Grid>
                        <Grid item>
                            <MenuButton url="/storyboard" buttonText="About"/>
                        </Grid>
                        <Grid item>
                            <MenuButton url="/test" buttonText="Test"/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </header>
      </div>
    )
}

export default MainPage
