import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Types for the store
export interface GenerationSettings {
  prompt: string
  negativePrompt?: string
  style: string
  aspectRatio: string
  quality: number
  creativity: number
  seed?: number
  steps: number
}

export interface ImageData {
  id: string
  url: string
  prompt: string
  settings: GenerationSettings
  createdAt: number
  dimensions: {
    width: number
    height: number
  }
}

export interface CanvasState {
  zoom: number
  pan: { x: number; y: number }
  selectedTool: string
  activeLayers: string[]
}

export interface EditorState {
  // Generation Settings
  generationSettings: GenerationSettings
  updateGenerationSettings: (settings: Partial<GenerationSettings>) => void
  
  // Images
  currentImage: ImageData | null
  generatedImages: ImageData[]
  setCurrentImage: (image: ImageData | null) => void
  addGeneratedImage: (image: ImageData) => void
  clearGeneratedImages: () => void
  
  // Canvas State
  canvasState: CanvasState
  updateCanvasState: (state: Partial<CanvasState>) => void
  
  // UI State
  isGenerating: boolean
  generationProgress: number
  generationMessage: string
  setGenerating: (isGenerating: boolean, progress?: number, message?: string) => void
  
  // History for undo/redo
  history: ImageData[]
  historyIndex: number
  addToHistory: (image: ImageData) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  
  // Export settings
  exportFormat: 'png' | 'jpg' | 'webp'
  exportQuality: number
  setExportSettings: (format: 'png' | 'jpg' | 'webp', quality?: number) => void
}

// Default values
const defaultGenerationSettings: GenerationSettings = {
  prompt: '',
  negativePrompt: '',
  style: 'photorealistic',
  aspectRatio: '1:1',
  quality: 80,
  creativity: 7.5,
  steps: 50
}

const defaultCanvasState: CanvasState = {
  zoom: 100,
  pan: { x: 0, y: 0 },
  selectedTool: 'select',
  activeLayers: ['background']
}

// Create the store
export const useEditorStore = create<EditorState>()(
  devtools(
    persist(
      (set, get) => ({
        // Generation Settings
        generationSettings: defaultGenerationSettings,
        updateGenerationSettings: (settings) =>
          set((state) => ({
            generationSettings: { ...state.generationSettings, ...settings }
          })),
        
        // Images
        currentImage: null,
        generatedImages: [],
        setCurrentImage: (image) => set({ currentImage: image }),
        addGeneratedImage: (image) =>
          set((state) => ({
            generatedImages: [image, ...state.generatedImages.slice(0, 19)] // Keep last 20
          })),
        clearGeneratedImages: () => set({ generatedImages: [] }),
        
        // Canvas State
        canvasState: defaultCanvasState,
        updateCanvasState: (state) =>
          set((current) => ({
            canvasState: { ...current.canvasState, ...state }
          })),
        
        // UI State
        isGenerating: false,
        generationProgress: 0,
        generationMessage: '',
        setGenerating: (isGenerating, progress = 0, message = '') =>
          set({ 
            isGenerating, 
            generationProgress: progress, 
            generationMessage: message 
          }),
        
        // History
        history: [],
        historyIndex: -1,
        addToHistory: (image) =>
          set((state) => {
            const newHistory = state.history.slice(0, state.historyIndex + 1)
            newHistory.push(image)
            return {
              history: newHistory.slice(-50), // Keep last 50 states
              historyIndex: Math.min(newHistory.length - 1, 49)
            }
          }),
        
        undo: () =>
          set((state) => {
            if (state.historyIndex > 0) {
              const newIndex = state.historyIndex - 1
              return {
                historyIndex: newIndex,
                currentImage: state.history[newIndex]
              }
            }
            return state
          }),
        
        redo: () =>
          set((state) => {
            if (state.historyIndex < state.history.length - 1) {
              const newIndex = state.historyIndex + 1
              return {
                historyIndex: newIndex,
                currentImage: state.history[newIndex]
              }
            }
            return state
          }),
        
        canUndo: () => get().historyIndex > 0,
        canRedo: () => get().historyIndex < get().history.length - 1,
        
        // Export settings
        exportFormat: 'png',
        exportQuality: 90,
        setExportSettings: (format, quality = 90) =>
          set({ exportFormat: format, exportQuality: quality })
      }),
      {
        name: 'nano-banana-editor',
        partialize: (state) => ({
          generationSettings: state.generationSettings,
          generatedImages: state.generatedImages.slice(0, 10), // Only persist last 10
          exportFormat: state.exportFormat,
          exportQuality: state.exportQuality
        })
      }
    ),
    {
      name: 'nano-banana-editor'
    }
  )
)

// Selector hooks for performance
export const useGenerationSettings = () => 
  useEditorStore((state) => state.generationSettings)

export const useCurrentImage = () => 
  useEditorStore((state) => state.currentImage)

export const useGeneratedImages = () => 
  useEditorStore((state) => state.generatedImages)

export const useCanvasState = () => 
  useEditorStore((state) => state.canvasState)

export const useGenerationState = () => 
  useEditorStore((state) => ({
    isGenerating: state.isGenerating,
    progress: state.generationProgress,
    message: state.generationMessage
  }))

export const useHistoryState = () =>
  useEditorStore((state) => ({
    canUndo: state.canUndo(),
    canRedo: state.canRedo(),
    undo: state.undo,
    redo: state.redo
  }))