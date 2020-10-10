import React, {useState} from "react";
import Ticker from "../../react-ticker";

const MoveStuffAround = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [move, setMove] = useState(false);

    const quotes = [
        '“1 We are convinced that liberty”',
        '“2 We are convinced that ”',
        '“3 We are ”',
        '“4 We are ”',
        '“5 We are ”',
        '“6 We are ”',
        '“7 We are ”',
    ]

    const secondQuotes = [
        1,
        2,
        3,
        4,
        5,
        6,
        7

    ]
    const onNext = (index) => {
        let activeIndex1 = (index) % quotes.length;

        if (move) {
            setActiveIndex(activeIndex1 + 1);

        } else {
            setMove(true)

        }

        console.log('Next ...', activeIndex1, index)
    };
    const onFinish = () => {
        console.log('finish')
        setMove(true)
    }
    return (
        <>
            <Ticker
                offset="70%"
                move={true}
                onNext={onNext}
                onFinish={onFinish}
            >
                {(index) => {
                    return (
                        <h1> {quotes[(index.index) % quotes.length]}</h1>
                    )
                }}
            </Ticker>
            <h2>{activeIndex} {secondQuotes[activeIndex % secondQuotes.length]}</h2>

        </>
    )
}

export default MoveStuffAround;