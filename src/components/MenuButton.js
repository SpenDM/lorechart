import React from 'react'
import { NavLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';

const buttonWidth = "200px";
const buttonHeight = "40px";

const MenuButton = ({ url, buttonText }) => {
    return (
        <div>
            <NavLink 
                    to={url}
                    className="button"
                    style={{ textDecoration: 'none' }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        style={{
                            maxWidth: buttonWidth, 
                            maxHeight: buttonHeight, 
                            minWidth: buttonWidth, 
                            minHeight: buttonHeight
                        }}
                    >
                        {buttonText}
                    </Button>
                </NavLink>
        </div>
    )
}

export default MenuButton
