import React from 'react';
import LogoImage from './raw/avax-logo.png'
import LogoImageSimple from './raw/avax-simple-logo.png'

/*
    Avalanche logo that wraps the png
*/
class AvalancheLogo extends React.Component {
    render() {
        return (
            <img src={this.props.simple ? LogoImageSimple : LogoImage} style={this.props.sx} alt='avalanche-logo' />
        )
    }
}

AvalancheLogo.defaultProps = {
    simple: false,
    square: false,
    sx: {}
}
export default React.forwardRef((props, ref) => <AvalancheLogo {...props} forwardedRef={ref} /> );