import { ListNode, ListItemNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TRANSFORMERS } from "@lexical/markdown";
import { Box, Text } from "@chakra-ui/react";
import { useColors } from "@/styles/theme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { TextNode } from "lexical";
import { LinkNode } from "@lexical/link";

interface LexicalEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LexicalEditor({ value, onChange }: LexicalEditorProps) {
  const colors = useColors();

  const theme = {
    paragraph: "mb-2",
    heading: {
      h1: "text-3xl font-bold mb-4",
      h2: "text-2xl font-bold mb-3",
      h3: "text-xl font-bold mb-2",
    },
    text: {
      bold: "font-bold",
      italic: "italic",
      underline: "underline",
    },
    editor: {
      background: colors.cardBg,
      borderColor: colors.border,
      color: colors.text.primary,
    },
    placeholder: {
      color: colors.text.secondary,
    },
  };

  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [
      TextNode,
      ListNode,
      ListItemNode,
      HeadingNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      LinkNode,
    ],
  };

  return (
    <Box>
      <Text mb={2}>내용</Text>
      <Box
        borderWidth={1}
        borderRadius="md"
        p={4}
        bg={colors.cardBg}
        borderColor={colors.border}
        _hover={{ borderColor: colors.primary.default }}
        _focusWithin={{ borderColor: colors.primary.default }}
      >
        <LexicalComposer initialConfig={initialConfig}>
          <div className="editor-container">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="editor-input min-h-[200px] outline-none"
                  style={{
                    color: colors.text.primary,
                    backgroundColor: colors.cardBg,
                  }}
                />
              }
              placeholder={
                <div
                  className="editor-placeholder"
                  style={{
                    color: colors.text.secondary,
                  }}
                >
                  내용을 입력하세요...
                </div>
              }
              ErrorBoundary={() => (
                <Text color="red.500">에디터에 오류가 발생했습니다.</Text>
              )}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          </div>
        </LexicalComposer>
      </Box>
    </Box>
  );
}
