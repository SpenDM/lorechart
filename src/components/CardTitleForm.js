import React from 'react'

const CardTitleForm = ({cardTitleText, setCardTitleText, setIsEditingTitle}) => {
    const [value, setValue] = React.useState(cardTitleText);

    const handleChange = (event) => {
        setValue(event.target.value);
    }
    
    const handleSubmit = (event) => {
        setCardTitleText(value);
        setIsEditingTitle(false);
        event.preventDefault();
    }
    
    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <input type="text" value={value} onChange={(e) => handleChange(e)} />
            <input type="submit" value="Submit" />
        </form>
    );
}

export default CardTitleForm