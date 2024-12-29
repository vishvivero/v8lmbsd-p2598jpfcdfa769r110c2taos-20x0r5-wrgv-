import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Code,
} from "lucide-react";
import { convertHtmlToJson, convertJsonToHtml, BlogContentNode } from '@/utils/blogContentUtils';
import { useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string, jsonContent?: BlogContentNode[]) => void;
  showJson?: boolean;
}

export const RichTextEditor = ({ content, onChange, showJson = false }: RichTextEditorProps) => {
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonContent, setJsonContent] = useState(() => {
    try {
      return JSON.stringify(convertHtmlToJson(content), null, 2);
    } catch (e) {
      return '[]';
    }
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const jsonContent = convertHtmlToJson(html);
      setJsonContent(JSON.stringify(jsonContent, null, 2));
      onChange(html, jsonContent);
      setJsonError(null);
    },
  });

  if (!editor) {
    return null;
  }

  const handleJsonChange = (newJsonContent: string) => {
    setJsonContent(newJsonContent);
    try {
      const parsedJson = JSON.parse(newJsonContent);
      const html = convertJsonToHtml(parsedJson);
      editor.commands.setContent(html);
      onChange(html, parsedJson);
      setJsonError(null);
    } catch (e) {
      setJsonError('Invalid JSON format');
    }
  };

  const toggleStyle = (active: boolean) =>
    active ? "bg-primary/10 text-primary hover:bg-primary/20" : "hover:bg-gray-100";

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={toggleStyle(editor.isActive('bold'))}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={toggleStyle(editor.isActive('italic'))}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={toggleStyle(editor.isActive('bulletList'))}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={toggleStyle(editor.isActive('orderedList'))}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={toggleStyle(editor.isActive('heading', { level: 1 }))}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={toggleStyle(editor.isActive('heading', { level: 2 }))}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={toggleStyle(editor.isActive('heading', { level: 3 }))}
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={toggleStyle(editor.isActive('codeBlock'))}
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 divide-y">
        <EditorContent 
          editor={editor} 
          className="prose max-w-none p-4 min-h-[200px] focus:outline-none"
        />
        {showJson && (
          <div className="p-4 bg-gray-50">
            <Textarea
              value={jsonContent}
              onChange={(e) => handleJsonChange(e.target.value)}
              className="font-mono text-sm h-[300px] overflow-auto"
              placeholder="Edit JSON structure here..."
            />
            {jsonError && (
              <p className="text-red-500 text-sm mt-2">{jsonError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};