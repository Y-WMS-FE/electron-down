import React, { PureComponent } from 'react';
import MDEContext from './MDE-Context';

class MDEProvider extends PureComponent {
    props: {
        children: any
    };
    state: any = {
        editStatus: null, // 0: 已保存, 1: 已编辑, 2': 第一次打开
        fileName: '未命名',
        fileText: '',
        filePath: '',
        MDE: null,
    };

    changeData = (data: any) => {
        if (data.hasOwnProperty('fileName')) {
            document.title = data.fileName;
        }
        this.setState(data);
    };

    changeValue = (key, value) => {
        this.changeData({ [key]: value });
    };

    renderMDE = (param: any, firstOpen: boolean = false) => {
        const { MDE } = this.state;
        const {
            fileName,
            fileText,
            filePath
        } = param;
        // 0: 已保存, 1: 已编辑, 2: 第一次打开
        const editStatus = firstOpen ? 2 : 1;
        // @todo: 增加主线程通知
        this.changeData({ fileName, fileText, editStatus, filePath });
        MDE.value(fileText);
    };

    render() {
        return (
            <MDEContext.Provider
                value={{
                    ...this.state,
                    changeValue: this.changeValue,
                    changeData: this.changeData,
                    renderMDE: this.renderMDE,
                }}
            >
                {this.props.children}
            </MDEContext.Provider>
        );
    }
}

export default MDEProvider;
