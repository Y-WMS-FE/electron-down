import React, { PureComponent } from 'react';
import SimpleMDE from 'simplemde';
import { ipcRenderer } from 'electron';
import MDEContext from '../MDE-Context';

class MDEContainer extends PureComponent {
    context: any;
    changeValue: (key: string, value: any) => {};

    initDropEvent = () => {
        document.addEventListener('drag', function (e) {
            e.preventDefault();
        }, false);

        document.addEventListener('dragstart', function (e) {
            e.preventDefault();
        }, false);

        document.addEventListener('dragend', function (e) {
            e.preventDefault();
        }, false);

        document.addEventListener('dragover', function (e) {
            e.preventDefault();
        }, false);

        document.addEventListener('dragenter', function (e: any) {
            if (e.target.id === 'a') {
                e.target.style.background = '#eee';
            }
        }, false);

        document.addEventListener('drop', (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            e.target.style.background = '';
            const dfItems = e.dataTransfer.items;
            let file;
            if (dfItems) {
                const item = dfItems[0];
                if (item.kind === 'file' && item.type === 'text/markdown' && item.webkitGetAsEntry().isFile) {
                    file = item.getAsFile();
                } else {
                    console.log('请拖拽文件');
                    return;
                }
                // ipcRenderer.send('ondragstart', file.path);
                const fr = new FileReader();
                fr.onload = (e) => {
                    console.log('文件加载成功');
                    const fileText: any = e.target.result;
                    const param: any = {
                        fileName: file.name,
                        filePath: file.path,
                        fileText,
                    };
                    this.context.renderMDE(param, true);
                };
                ipcRenderer.send('ondragstart', file.path);
                fr.readAsText(file);
            }
        }, false);
    };

    bindShortcuts = (MDE) => {
        window.addEventListener('keydown', async (e) => {
            let command = e.metaKey;
            if (command && e.key === 's') {
                console.log('文件保存');
                const fileText = MDE.value();
                const r = await ipcRenderer.invoke('save', this.context.filePath, fileText);
                const { changeData } = this.context;
                if (r.code === '0') {
                    const { fileName, filePath } = r.info;
                    changeData({
                        fileName,
                        fileText,
                        filePath,
                        editStatus: 0,
                    });
                } else {
                    console.log(r);
                }
            }
        }, true);
    };

    createMDE() {
        return new SimpleMDE({
            element: document.querySelector('#mdeBox'),
            autofocus: true,
            spellChecker: false,
            tabSize: 1
        });
    }

    bindMDEChange = (MDE) => {
        MDE.codemirror.on('change', () => {
            const { editStatus, MDE } = this.context;
            console.log(editStatus);
            if (!editStatus) {
                this.changeValue('editStatus', 1);
            } else if (editStatus === 2) {
                this.changeValue('editStatus', 0);
            }
        });
    };

    init = () => {
        const { changeValue } = this.context;
        let { MDE } = this.context;
        if (!this.changeValue && changeValue) {
            this.changeValue = changeValue;
        }
        if (!MDE) {
            MDE = this.createMDE();
            this.bindMDEChange(MDE);
            this.initDropEvent();
            this.bindShortcuts(MDE);
            this.changeValue('MDE', MDE);
        }
    };

    componentDidMount() {
        this.init();
    }

    render() {
        return (
            <textarea id="mdeBox"></textarea>
        );
    }
}

MDEContainer.contextType = MDEContext;

export default MDEContainer;

