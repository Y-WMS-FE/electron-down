import React, { PureComponent } from 'react';
import { render } from 'react-dom';
import 'simplemde/dist/simplemde.min.css';
import MDEProvider from './MDE-Provider';
import MDEContainer from './components/MDE-Container';
import Header from './components/Header';

const { Fragment } = React;

class Entry extends PureComponent {
    render() {
        return (
            <MDEProvider>
                <Header />
                <MDEContainer />
            </MDEProvider>
        );
    }
}


render(
    (<Entry />),
    document.querySelector('#container')
);
