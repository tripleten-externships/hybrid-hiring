import React from 'react';

type Variant = 'primary' | 'secondary' | 'outline' |'ghost';
type Size = 'sm' | 'md' | 'lg';
type ButtonType = 'Button' | 'submit' | 'reset';

export const Button = ({
    variant = 'primary',
    size = 'md',
    loading= false,
    disable =  false,
    fullWidth = false,
})