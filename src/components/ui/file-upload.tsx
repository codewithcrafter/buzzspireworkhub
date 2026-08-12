"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UploadCloud, File, AlertCircle, CheckCircle, RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  onFileSelect?: (file: File) => void
  maxSizeMB?: number
  allowedTypes?: string[]
}

function FileUpload({
  className,
  onFileSelect,
  maxSizeMB = 5,
  allowedTypes = ["image/png", "image/jpeg", "application/pdf"],
  ...props
}: FileUploadProps) {
  const [isDragActive, setIsDragActive] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const [status, setStatus] = React.useState<"idle" | "uploading" | "success" | "error">("idle")
  const [progress, setProgress] = React.useState(0)
  const [errorMessage, setErrorMessage] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }

  const validateFile = (file: File): boolean => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMessage(`File exceeds ${maxSizeMB}MB limit.`)
      setStatus("error")
      return false
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      setErrorMessage("Unsupported file format.")
      setStatus("error")
      return false
    }

    return true
  }

  const startUploadSimulation = (selectedFile: File) => {
    setFile(selectedFile)
    setStatus("uploading")
    setProgress(0)
    setErrorMessage("")

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setStatus("success")
          onFileSelect?.(selectedFile)
          return 100
        }
        return prev + 10
      })
    }, 150)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (validateFile(droppedFile)) {
        startUploadSimulation(droppedFile)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (validateFile(selectedFile)) {
        startUploadSimulation(selectedFile)
      }
    }
  }

  const handleReset = () => {
    setFile(null)
    setStatus("idle")
    setProgress(0)
    setErrorMessage("")
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div
      className={cn(
        "w-full max-w-lg border border-dashed rounded-2xl p-6 text-center transition-all duration-300 select-none bg-card/50",
        isDragActive ? "border-primary bg-primary/5" : "border-border/80 hover:border-border-hover",
        className
      )}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      {...props}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleInputChange}
        accept={allowedTypes.join(",")}
      />

      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 cursor-pointer py-4"
            onClick={() => inputRef.current?.click()}
          >
            <div className="size-11 rounded-xl bg-muted border border-border/40 flex items-center justify-center text-muted-foreground">
              <UploadCloud className="size-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Click to upload or drag & drop</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPEG, or PDF (max. {maxSizeMB}MB)</p>
            </div>
          </motion.div>
        )}

        {status === "uploading" && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 py-4"
          >
            <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <File className="size-5 animate-pulse" />
            </div>
            <div className="w-full max-w-xs space-y-2">
              <p className="text-xs font-semibold text-foreground truncate">{file?.name}</p>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-bold">{progress}% uploaded</p>
            </div>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 py-4"
          >
            <div className="size-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <CheckCircle className="size-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Upload Complete!</p>
              <p className="text-xs text-muted-foreground truncate max-w-[240px] mt-1">{file?.name}</p>
            </div>
            <Button variant="ghost" size="xs" onClick={handleReset} className="mt-2 text-xs cursor-pointer">
              Upload Another
            </Button>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 py-4"
          >
            <div className="size-11 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
              <AlertCircle className="size-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Upload Failed</p>
              <p className="text-xs text-destructive mt-1">{errorMessage}</p>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={handleReset}
              className="mt-2 flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <RefreshCcw className="size-3" />
              <span>Retry</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { FileUpload }
export type { FileUploadProps }
