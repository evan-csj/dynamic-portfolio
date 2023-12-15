import { tabsAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(tabsAnatomy.keys);

const dateRangeVariant = definePartsStyle(() => {
    return {
        tab: {
            px: 0,
            mx: 4,
            borderBottom: '2px',
            borderBottomColor: 'light.white',
            _selected: {
                color: 'light.blue',
                borderBottomColor: 'light.blue',
            },
        },
        tablist: {},
        tabpanel: {},
    };
});

const variants = {
    dateRange: dateRangeVariant,
};

export const tabsTheme = defineMultiStyleConfig({ variants });
