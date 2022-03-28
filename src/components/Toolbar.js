import React from 'react';
import { NavLink } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import MapIcon from '@material-ui/icons/Map';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import FolderIcon from '@material-ui/icons/Folder';
import HomeIcon from '@material-ui/icons/Home';
import RemoveIcon from '@material-ui/icons/Remove';


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      alignContent: 'center',
      '& > *': {
        backgroundColor: '#1c2c2e',
        padding: '0px 8px',
      },
    },
  }));


const Toolbar = () => {
    const iconStyle = useStyles();

    return (
        <div className={iconStyle.root}>
            <Paper 
                elevation={5}
                style={{
                    alignContent: 'center',
                    justifyContent: 'center',
            }}>
                <div>
                    <Tooltip title="Plot View" placement="right">
                        <AccountTreeIcon className="icon" fontSize="large"/>
                    </Tooltip>
                </div>
                <div>
                    <Tooltip title="Map View" placement="right">
                        <MapIcon className="icon" fontSize="large"/>
                    </Tooltip>
                </div>
                <div>
                    <RemoveIcon className="divider" fontSize="large"/>
                </div>
                <div>
                    <Tooltip title="Save Story" placement="right">
                        <SaveAltIcon className="icon" fontSize="large"/>
                    </Tooltip>
                </div>
                <div>
                    <Tooltip title="Load Story" placement="right">
                        <FolderIcon className="icon" fontSize="large"/>
                    </Tooltip>
                </div>
                <div>
                    <RemoveIcon className="divider" fontSize="large"/>
                </div>
                <div>
                    <Tooltip title="Main Page" placement="right">
                        <NavLink to="/">
                            <HomeIcon className="icon" fontSize="large"/>
                        </NavLink>
                    </Tooltip>
                </div>
            </Paper>
        </div>
    )
}

export default Toolbar
