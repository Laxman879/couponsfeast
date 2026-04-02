'use client';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false, loading: () => <div className="h-48 bg-slate-50 rounded-xl animate-pulse" /> });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote'],
    ['link'],
    [{ align: [] }],
    ['clean'],
  ],
};

const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'blockquote', 'link', 'align'];

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  return (
    <div className="rich-editor">
      <ReactQuill theme="snow" value={value} onChange={onChange} modules={modules} formats={formats} placeholder={placeholder || 'Write your content here...'} />
      <style jsx global>{`
        .rich-editor .ql-container { min-height: 200px; font-size: 14px; border-radius: 0 0 12px 12px; border-color: #e2e8f0; }
        .rich-editor .ql-toolbar { border-radius: 12px 12px 0 0; border-color: #e2e8f0; background: #f8fafc; }
        .rich-editor .ql-editor { min-height: 200px; }
        .rich-editor .ql-editor h1 { font-size: 1.75em; font-weight: 700; margin: 0.5em 0; }
        .rich-editor .ql-editor h2 { font-size: 1.5em; font-weight: 700; margin: 0.5em 0; }
        .rich-editor .ql-editor h3 { font-size: 1.25em; font-weight: 600; margin: 0.5em 0; }
        .rich-editor .ql-editor p { margin: 0.5em 0; }
        .rich-editor .ql-editor ul, .rich-editor .ql-editor ol { padding-left: 1.5em; margin: 0.5em 0; }
        .rich-editor .ql-editor li { margin: 0.25em 0; }
        .rich-editor .ql-editor a { color: #6366f1; }
      `}</style>
    </div>
  );
}
