import React, { PureComponent, Component } from 'react';
import MDEContext from '../MDE-Context';
import '../style.css';

const { Consumer } = MDEContext;
const HeaderStatus = (props) => {
    return (
        <Consumer>
            {
                ({editStatus}) => editStatus === 1 && (<span className="header-status">-已编辑</span>)
            }
        </Consumer>

    );
};

export default HeaderStatus;
