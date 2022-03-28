import React from 'react'
import { useState } from 'react';
import PlotCard from '../components/PlotCard';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import NameForm from './NameForm';

const NONE = "none";


const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: "100vh",
        backgroundColor: "#1c2c2e",
        '& > *': {
            backgroundColor: '#ffd895',
        },
    },
  }));


const Canvas = () => {
    const [cardDict, setCardDict]  = useState({});
    const [nextCardId, setNextCardId] = useState(0);
    const [objBelowMouse, setObjBelowMouse] = useState(NONE);

    const canvasStyle = useStyles();

    // R Click on Canvas: Card creation
    const handleCanvasRClick = (e) => {
        // Don't show context menu
        e.preventDefault();

        // Create card if above empty space
        if (objBelowMouse === NONE) {

            // Get mouse position
            let canvasRect = e.target.getBoundingClientRect();
            let mouseX = e.clientX - canvasRect.left;
            let mouseY = e.clientY;

            // Create card at mouse position
            let card = <PlotCard 
                            key={nextCardId}
                            id={nextCardId}
                            startX={mouseX} 
                            startY={mouseY}
                            handleMouseOver={handleMouseOverCard}
                            handleMouseLeave={handleMouseLeaveCard}
                            handleCardRClick={handleCardRClick}
                        />;

            // Add card to card dict for rendering
            let newCardDict = Object.assign({}, cardDict, {[nextCardId]: card});
            setCardDict(newCardDict);

            setNextCardId(nextCardId + 1);
        }
    }

    // Mouse Hover Over Card: Set Focus to Card
    const handleMouseOverCard = (cardId) => {
        setObjBelowMouse(prevObj => cardId);
    }

    // Mouse Leave Card: Change Focus Away from Card
    const handleMouseLeaveCard = (cardId) => {
        setObjBelowMouse(prevObj => {
            if (prevObj === cardId) {
                return NONE;
            }
        });
    }

    // Right Click on Card: Delete Card
    const handleCardRClick = (cardId) => {
        // TODO -- ADD WARNING or just allow Ctrl+Z undo

        // Remove card 
        setCardDict(prevCardDict => {
            const { [cardId]: value, ...newCardDict } = prevCardDict;
            return newCardDict;
        })

        // Update focus now that card is deleted
        setObjBelowMouse(prevObj => {
            if (prevObj === cardId) {
                return NONE;
            }
        });
    }

    // Render all active Cards
    const displayCards = ( cardDict ) => {
        let content = [];
        for (let id in cardDict) {
            content.push(cardDict[id]);
        }
    
        return (
            <>
                {content}
            </>
        )
    }

    // Render Canvas
    return (
        <Paper 
            className={canvasStyle.root}
            onContextMenu={handleCanvasRClick}
        >
            <NameForm/>
            {displayCards(cardDict)}
        </Paper>
    )
}

export default Canvas
