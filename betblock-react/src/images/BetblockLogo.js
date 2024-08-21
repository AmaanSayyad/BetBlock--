import React from 'react';
import LogoImageSquare from './raw/betblock-logo-square.png'
import LogoImage from './raw/betblock-logo.png'

/*
    Betblock logo that wraps the png
*/
class BetblockLogo extends React.Component {
    render() {
        return (
            <img src={this.props.square ? LogoImageSquare : LogoImage} style={this.props.sx} alt='betblock-logo' />
        )
    }
}

BetblockLogo.defaultProps = {
    square: false,
    sx: {}
}
export default React.forwardRef((props, ref) => <BetblockLogo {...props} forwardedRef={ref} /> );