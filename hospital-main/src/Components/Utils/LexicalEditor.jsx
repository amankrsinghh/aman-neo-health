import React from "react";
import {
  LexicalComposer,
  RichTextPlugin,
  ContentEditable,
  HistoryPlugin,
  OnChangePlugin,
} from "@lexical/react";

import { $getRoot, $getSelection } from "lexical";

const theme = {
  paragraph: "mb-2",
};

const onError = (error) => {
  console.error(error);
};

const LexicalEditor = ({ value, onChange }) => {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
  };

  const handleChange = (editorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const text = root.getTextContent();
      onChange(text); // simple text (you can store HTML later)
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border rounded p-2">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="outline-none min-h-[150px]" />
          }
          placeholder={<div className="text-gray-400">Write here...</div>}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />
      </div>
    </LexicalComposer>
  );
};

export default LexicalEditor;