import React, { useState } from 'react';
import { CloseIcon } from '@chakra-ui/icons';
import {
    Grid,
    GridItem,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Tooltip,
} from '@chakra-ui/react';

function PortfolioItem(props) {
    const ticker = props.ticker;
    const pct = props.pct;
    const max = props.max;
    const updatePct = props.update;
    const [sliderValue, setSliderValue] = useState(pct);
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <Grid className="grid-portfolio" zIndex='1'>
            <GridItem fontWeight="bold">{ticker}</GridItem>
            <GridItem>
                <Slider
                    w={`${max}%`}
                    id="slider"
                    defaultValue={pct}
                    min={1}
                    max={max}
                    onChange={value => {
                        if (value <= max) {
                            setSliderValue(value);
                            updatePct(ticker, value);
                        } else {
                            setSliderValue(max);
                            updatePct(ticker, max);
                        }
                    }}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <Tooltip
                        hasArrow
                        bg="light.yellow"
                        color="white"
                        placement="top"
                        isOpen={showTooltip}
                        label={`${sliderValue}%`}
                    >
                        <SliderThumb borderColor="light.yellow" borderWidth='2px'/>
                    </Tooltip>
                </Slider>
            </GridItem>
            <GridItem textAlign="right">{pct}%</GridItem>
            <GridItem textAlign="right">
                <CloseIcon
                    cursor="pointer"
                    onClick={() => props.delete(ticker)}
                />
            </GridItem>
        </Grid>
    );
}

export default PortfolioItem;
