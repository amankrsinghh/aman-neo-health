import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

export default function RichEditor({ value, onChange }) {

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Image
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  if (!editor) return null;

  return (
    <div className="editor-wrapper">

      {/* Toolbar */}
      <div className="editor-toolbar">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>1 List</button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="editor-content" />

    </div>
  );
}
