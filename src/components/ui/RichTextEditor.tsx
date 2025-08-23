'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useState, useRef, useEffect, useCallback } from 'react';

// Custom Image extension with better controls
const CustomImage = Image.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200',
        style: 'max-width: 100%; height: auto; display: block; margin: 1rem auto;',
      },
    };
  },
  
  addCommands() {
    return {
      ...this.parent?.(),
      removeImage: () => ({ commands }: { commands: any }) => {
        return commands.deleteSelection();
      },
    };
  },
});

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    
    try {
      // Convert to base64 for now (in production, upload to cloud storage)
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (editor && base64) {
          editor.chain().focus().setImage({ 
            src: base64, 
            alt: file.name,
            title: file.name 
          }).run();
        }
      };
      reader.onerror = () => {
        alert('Failed to read image file');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image. Please try again.');
    }
  }, [editor]);

  const removeImage = useCallback(() => {
    if (editor) {
      // If an image is selected, remove it
      if (editor.isActive('image')) {
        editor.chain().focus().deleteSelection().run();
      } else {
        // If cursor is on an image, remove the image node
        const { $from } = editor.state.selection;
        if ($from.parent.type.name === 'image') {
          editor.chain().focus().deleteSelection().run();
        }
      }
    }
  }, [editor]);

  const addImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const addLink = useCallback(() => {
    if (linkUrl.trim()) {
      if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://')) {
        editor.chain().focus().setLink({ href: linkUrl }).run();
        setLinkUrl('');
        setShowLinkInput(false);
      } else {
        alert('Please enter a valid URL starting with http:// or https://');
      }
    } else {
      alert('Please enter a URL');
    }
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor.chain().focus().toggleOrderedList().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-gray-50 border-b border-gray-200 p-4">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Basic Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            editor.isActive('bold') ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            editor.isActive('italic') ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Italic"
        >
          <em>I</em>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            editor.isActive('underline') ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Underline"
        >
          <u>U</u>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        {/* Headings */}
        <select
          onChange={(e) => {
            if (e.target.value === 'paragraph') {
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().toggleHeading({ level: parseInt(e.target.value) }).run();
            }
          }}
          className="px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-700"
          value={editor.isActive('heading', { level: 1 }) ? '1' : 
                 editor.isActive('heading', { level: 2 }) ? '2' : 
                 editor.isActive('heading', { level: 3 }) ? '3' : 
                 editor.isActive('heading', { level: 4 }) ? '4' : 
                 editor.isActive('heading', { level: 5 }) ? '5' : 
                 editor.isActive('heading', { level: 6 }) ? '6' : 'paragraph'}
        >
          <option value="paragraph">Normal</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </select>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        {/* Lists */}
        <button
          type="button"
          onClick={toggleBulletList}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            editor.isActive('bulletList') ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Bullet List"
        >
          • List
        </button>
        
        <button
          type="button"
          onClick={toggleOrderedList}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            editor.isActive('orderedList') ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Numbered List"
        >
          1. List
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        {/* Link */}
        <button
          type="button"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            editor.isActive('link') ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Link"
        >
          🔗 Link
        </button>

        {editor.isActive('link') && (
          <button
            type="button"
            onClick={removeLink}
            className="px-3 py-2 rounded text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            title="Remove Link"
          >
            Remove Link
          </button>
        )}

        {showLinkInput && (
          <div className="flex items-center space-x-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL (https://...)"
              className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white placeholder-gray-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addLink();
                }
              }}
            />
            <button
              type="button"
              onClick={addLink}
              className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl('');
              }}
              className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        {/* Image */}
        <button
          type="button"
          onClick={addImage}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            editor.isActive('image') ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Add Image"
        >
          🖼️ Image
        </button>

        {editor.isActive('image') && (
          <button
            type="button"
            onClick={removeImage}
            className="px-3 py-2 rounded text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            title="Remove Image (or press Delete/Backspace)"
          >
            ❌ Remove
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Fallback to simple textarea if rich text editor fails
  if (useFallback) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-2">Rich text editor unavailable. Using simple text editor.</p>
          <button
            type="button"
            onClick={() => setUseFallback(false)}
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Try rich text editor again
          </button>
        </div>
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Start writing your story...'}
          className="w-full min-h-[400px] p-6 border-0 focus:outline-none resize-none text-gray-900"
          rows={20}
        />
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="min-h-[400px] p-4 bg-white">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  try {
    return <RichTextEditorContent content={content} onChange={onChange} placeholder={placeholder} />;
  } catch (error) {
    console.error('Rich text editor failed to load:', error);
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-2">Rich text editor unavailable. Using simple text editor.</p>
          <button
            type="button"
            onClick={() => setUseFallback(true)}
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Use simple text editor
          </button>
        </div>
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Start writing your story...'}
          className="w-full min-h-[400px] p-6 border-0 focus:outline-none resize-none text-gray-900"
          rows={20}
        />
      </div>
    );
  }
}

function RichTextEditorContent({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      CustomImage.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200',
          style: 'max-width: 100%; height: auto; display: block; margin: 1rem auto;',
        },
        allowBase64: true,
        inline: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
        validate: (href) => /^https?:\/\//.test(href),
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      try {
        const html = editor.getHTML();
        onChange(html);
      } catch (error) {
        console.error('Error updating editor content:', error);
      }
    },
    immediatelyRender: false,
    editable: true,
  });

  // Prevent any navigation or redirect issues
  useEffect(() => {
    if (editor) {
      // Ensure editor stays focused and doesn't cause navigation
      const handleKeyDown = (event: KeyboardEvent) => {
        // Prevent any default navigation behavior
        if (event.key === 'Escape') {
          event.preventDefault();
          editor.commands.focus();
        }
        
        // Delete key to remove selected images
        if (event.key === 'Delete' || event.key === 'Backspace') {
          if (editor.isActive('image')) {
            event.preventDefault();
            editor.chain().focus().deleteSelection().run();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="min-h-[400px] p-4 bg-white">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="min-h-[400px] p-6 bg-white text-gray-900 focus:outline-none prose prose-sm max-w-none"
        style={{
          // Ensure images are responsive on mobile
          '--tw-prose-img-max-width': '100%',
          '--tw-prose-img-height': 'auto',
        } as React.CSSProperties}
      />
      <style jsx global>{`
        .ProseMirror img {
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
          margin: 1rem auto !important;
          border-radius: 0.5rem !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          cursor: pointer !important;
          transition: box-shadow 0.2s ease-in-out !important;
        }
        .ProseMirror img:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
        }
        .ProseMirror img:focus {
          outline: 2px solid #3b82f6 !important;
          outline-offset: 2px !important;
        }
        @media (max-width: 768px) {
          .ProseMirror img {
            margin: 0.5rem auto !important;
            max-width: calc(100% - 2rem) !important;
          }
        }
      `}</style>
    </div>
  );
}
