import { useEffect, useRef } from "react";
import * as Y from 'yjs';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import { QuillBinding } from 'y-quill';
import { WebsocketProvider } from 'y-websocket';

interface EditorProps {
    docId: string;
}

const RealTimeEditor = ({docId}: EditorProps) => {
    const quillRef = useRef<HTMLDivElement>(null);
    const ydocRef = useRef<Y.Doc | null>(null);
    const providerRef = useRef<WebsocketProvider | null>(null);

    useEffect(() => {
        if (!quillRef.current) return;

        //初始化Yjs文档和WebSocket连接
        const ydoc = new Y.Doc();
        const provider = new WebsocketProvider(
            'ws://localhost:8080/ws',
            docId,
            ydoc,
            {
                params: {
                    token: localStorage.getItem('token') || ''
                }
            }
        );

        provider.on('status', (event: { status: string }) => {
            console.log('WebSocket status:', event.status);
        });

        const ytext = ydoc.getText('content');

        //配置Quill编辑器
        Quill.register('modules/cursors', QuillCursors);
        const quill = new Quill(quillRef.current, {
            theme: 'snow',
            modules: {
                cursors: true,
                toolbar: [
                    [{header: [1, 2, false]}],
                    ['bold', 'italic', 'underline'],
                    ['code-block', 'link'],
                ]    
            },
        });

        //将Yjs文档绑定到Quill编辑器
        const binding = new QuillBinding(ytext, quill);

        ydocRef.current = ydoc;
        providerRef.current = provider;

        //清理函数
        return () => {
            binding.destroy();
            provider.destroy();
            ydoc.destroy();
        };
    }, [docId]);

    return <div ref={quillRef} style={{height: '80vh'}} />;
};

export default RealTimeEditor;
    