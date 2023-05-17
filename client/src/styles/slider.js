import { sliderAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);
const baseStyle = definePartsStyle({
    filledTrack: {
        bg: 'light.navy',
    },
});
export const sliderTheme = defineMultiStyleConfig({ baseStyle });
