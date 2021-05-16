import React from 'react'
import Draggable from 'react-draggable';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 120,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  }
}));

const PlotCard = ( {id, startX, startY, handleMouseOver, handleMouseLeave, handleCardRClick} ) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const initialPos = {
    x: startX,
    y: startY,
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
      // onStart: This is called when dragging event invokes.
      // onDrag: Invoked when the drag event is in process.
      // onStop: This event evokes when dragging ends.
      // onMouseUp: This is event is evoked when the mouse is moved before stoping the drag.
      // onMouseDown: Called when the mouse is clicked to begin drag.
      // onTouchEnd: This is called in touch state before the drag ends.
      // onTouchStart: Invoked in touch condition before drag begins.

    // bounds: {left?: number, top?: number, right?: number, bottom?: number }
    <Draggable 
      bounds="parent"
      defaultPosition={initialPos}
    >
        <Card 
          className={classes.root}
          style={{
            position: "absolute",
          }}

          onMouseOver={() => {handleMouseOver(id)}}
          onMouseOut={() => handleMouseLeave(id)}
          onContextMenu={() => handleCardRClick(id)}
        >
            <CardHeader
                title="League of Warlocks"
                className={classes.root}
            />
            <CardActions disableSpacing>
                <IconButton
                  className={clsx(classes.expand, {
                      [classes.expandOpen]: expanded,
                  })}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                <Typography paragraph>
                    Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                    minutes.
                </Typography>
                </CardContent>
            </Collapse>
        </Card>
    </Draggable>
  );
}


export default PlotCard
