"use client"

import * as React from "react"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Code,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RichTextEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string
  value?: string
  onChangeValue?: (value: string) => void
}

function RichTextEditor({
  className,
  placeholder = "Write something beautiful...",
  value = "",
  onChangeValue,
  ...props
}: RichTextEditorProps) {
  const [htmlContent, setHtmlContent] = React.useState(value)
  const [activeFormats, setActiveFormats] = React.useState<string[]>([])

  const handleFormat = (format: string) => {
    const isFormatActive = activeFormats.includes(format)
    if (isFormatActive) {
      setActiveFormats(activeFormats.filter((f) => f !== format))
    } else {
      setActiveFormats([...activeFormats, format])
    }
    // In a real editor, this would run document.execCommand or update editor node trees.
  }

  const formatButtons = [
    { format: "bold", icon: <Bold className="size-4" />, label: "Bold" },
    { format: "italic", icon: <Italic className="size-4" />, label: "Italic" },
    { format: "underline", icon: <Underline className="size-4" />, label: "Underline" },
    { format: "h1", icon: <Heading1 className="size-4" />, label: "Heading 1" },
    { format: "h2", icon: <Heading2 className="size-4" />, label: "Heading 2" },
    { format: "bullet", icon: <List className="size-4" />, label: "Bullet list" },
    { format: "ordered", icon: <ListOrdered className="size-4" />, label: "Numbered list" },
    { format: "link", icon: <Link2 className="size-4" />, label: "Link" },
    { format: "code", icon: <Code className="size-4" />, label: "Code block" },
  ]

  const alignButtons = [
    { format: "left", icon: <AlignLeft className="size-4" /> },
    { format: "center", icon: <AlignCenter className="size-4" /> },
    { format: "right", icon: <AlignRight className="size-4" /> },
  ]

  return (
    <div
      className={cn(
        "w-full border border-border/60 bg-card rounded-2xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary/50 transition-all select-none",
        className
      )}
      {...props}
    >
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-muted/40 border-b border-border/40">
        <div className="flex items-center gap-0.5">
          {formatButtons.map((btn) => {
            const isActive = activeFormats.includes(btn.format)
            return (
              <Button
                key={btn.format}
                type="button"
                variant={isActive ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => handleFormat(btn.format)}
                className="cursor-pointer size-8 rounded-lg"
                title={btn.label}
              >
                {btn.icon}
              </Button>
            )
          })}
        </div>

        <span className="h-4 w-px bg-border/80 mx-1" />

        <div className="flex items-center gap-0.5">
          {alignButtons.map((btn, idx) => {
            const isActive = activeFormats.includes(`align-${btn.format}`) || (idx === 0 && !activeFormats.some(f => f.startsWith("align-")))
            return (
              <Button
                key={btn.format}
                type="button"
                variant={isActive ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => handleFormat(`align-${btn.format}`)}
                className="cursor-pointer size-8 rounded-lg"
              >
                {btn.icon}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="p-4 min-h-[160px] relative text-sm focus:outline-none">
        <textarea
          value={htmlContent}
          onChange={(e) => {
            setHtmlContent(e.target.value)
            onChangeValue?.(e.target.value)
          }}
          placeholder={placeholder}
          className="w-full min-h-[160px] bg-transparent resize-none border-none outline-none text-foreground placeholder:text-muted-foreground/60 leading-relaxed focus:ring-0 focus:outline-none font-sans"
        />
        <div className="absolute bottom-2.5 right-3 text-[10px] text-muted-foreground font-bold tracking-wide uppercase select-none">
          Markdown supported
        </div>
      </div>
    </div>
  )
}

export { RichTextEditor }
export type { RichTextEditorProps }
