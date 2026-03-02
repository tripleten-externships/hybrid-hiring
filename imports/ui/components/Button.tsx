import React from 'react';

type Variant = 'primary' | 'secondary' | 'outline' |'ghost';
type Size = 'sm' | 'md' | 'lg';
type ButtonType = 'button' | 'submit' | 'reset';

interface ButtonProps {
    variant?: Variant;
    size? : Size;
    loading? : boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    type?: ButtonType;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;


}

const Spinner = () => (
    <svg
className = "btn__spinner"
fill = "none"
viewBox = "0 0 24 24"
aria-hidden = "true"
>
    <circle
    className = "btn__spinner-track"
    cx= "12"
cy = "12"
r = "10"
stroke = "currentColor"
strokeWidth = "4"
/>
<path
className='btn__spinner-arc'
fill= "currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
      </svg>
);

export const Button = ({
    variant = 'primary',
    size = 'md',
    loading= false,
    disabled =  false,
    fullWidth = false,
    type = 'button',
    onClick,
    children,
}: ButtonProps) => {
    const isDisabled = disabled || loading;

    const classes = [
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth ? 'btn--full-width' : '',
        isDisabled ? 'btn--disabled': '',

    ]

    .filter(Boolean)
    .join(' ');


    return(
        <button
        type={type}
        className={classes}
        disabled ={isDisabled}
        onClick={isDisabled ? undefined : onClick}
        aria-busy= {loading}
        >
            {loading && <Spinner />}
            <span className={loading ? 'btn__label btn__label--hidden' : 'btn__label'}>
                {children}
                </span>
                </button>

    );


};