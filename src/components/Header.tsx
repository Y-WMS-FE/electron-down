import React, { PureComponent } from 'react';
import HeaderStatus from './Header-Status';
import MDEContext from '../MDE-Context';
import '../style.css';

class Header extends PureComponent {
    context: any;

    render() {
        const { fileName } = this.context;
        return (
            <div
                className="header"
            >
                {fileName}
                <HeaderStatus />
            </div>
        );
    }
}

PureComponent.contextType = MDEContext;

export default Header;

