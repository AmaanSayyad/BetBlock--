import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import {ReactComponent as ChainlinkSvg} from './raw/chainlink-blue.svg'
import {ReactComponent as ChainlinkSimpleSvg} from './raw/chainlink-simple-blue.svg'

/*
    Chainlink SVG converted into an Icon component for material-UI
*/
class ChainlinkLogo extends React.Component {
    render() {
        const {forwardedRef, ...props} = this.props
        return (
            <SvgIcon {...props} inheritViewBox component={this.props.simple ? ChainlinkSimpleSvg : ChainlinkSvg} ref={forwardedRef} />
        )
    }
}

export default React.forwardRef((props, ref) => <ChainlinkLogo {...props} forwardedRef={ref} /> );