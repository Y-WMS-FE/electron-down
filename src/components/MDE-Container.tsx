import React, { PureComponent } from 'react';
import SimpleMDE from 'simplemde';
import { ipcRenderer } from 'electron';
import Stackedit from 'Stackedit'
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
                fr.onload = async (e) => {
                    console.log('文件加载成功');
                    const fileText: any = e.target.result;
                    const param: any = {
                        fileName: file.name,
                        filePath: file.path,
                        fileText,
                    };
                    const { editStatus } = this.context;
                    console.log(editStatus);
                    const r = await ipcRenderer.invoke('ondragstart', file.path);
                    if (!r) {
                        return;
                    }
                    if (editStatus !== null) {
                        const { webContentsId } = await ipcRenderer.invoke('window-open');
                        ipcRenderer.sendTo(webContentsId, 'rendMDE', param);
                        return;
                    }
                    this.context.renderMDE(param, true);
                };
                fr.readAsText(file);
            }
        }, false);

        ipcRenderer.on('rendMDE', (e, param) => {
            this.context.renderMDE(param, true);
        });

        window.onbeforeunload = (e) => {
            const { MDE, filePath, editStatus } = this.context;
            const fileText = MDE.value();
            if (editStatus === 1 && filePath) {
                ipcRenderer.sendSync('save', filePath, fileText);
            }
            const r = ipcRenderer.sendSync('pre-close', filePath, fileText);
            if (!r) {
                e.returnValue = false;
            }
        }
    };

    bindShortcuts = (MDE) => {
        window.addEventListener('keydown', async (e) => {
            let command = e.metaKey;
            if (command) {
                const fileText = MDE.value();
                switch (e.key) {
                    case 's':
                        console.log('文件保存');
                        const r = ipcRenderer.sendSync('save', this.context.filePath, fileText);
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
                        break;
                    case 'n':
                        console.log('新建窗口');
                        await ipcRenderer.invoke('window-open');
                        break;
                    /*case 'w':
                        e.preventDefault();
                        console.log(fileText); // 内容
                        ipcRenderer.send('pre-close', this.context.filePath, fileText);
                        break;*/
                    default:
                        break;
                }
            }
        }, true);
    };

    createMDE() {
        return new SimpleMDE({
            element: document.querySelector('#mdeBox'),
            autofocus: true,
            toolbar: false,
            spellChecker: false,
            tabSize: 1
        });
    }

    bindMDEChange = (MDE) => {
        MDE.codemirror.on('change', () => {
            const { editStatus, MDE } = this.context;
            console.log(editStatus);
            // 0: 已保存, 1: 已编辑, 2: 第一次打开
            // @todo: 增加主线程通知
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
            <div className="mde-container">
                <textarea id="mdeBox"></textarea>
            </div>
        );
    }
}

MDEContainer.contextType = MDEContext;

export default MDEContainer;

