'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, Volume2, RotateCcw, Languages, Zap } from 'lucide-react'

interface WordData {
  word: string
  translation: string
  difficulty: 'easy' | 'medium' | 'hard'
  frequency: number
}

export default function EnglishHelperPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [words, setWords] = useState<WordData[]>([])
  const [fileName, setFileName] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sample difficulty analysis function
  const analyzeDifficulty = (word: string): 'easy' | 'medium' | 'hard' => {
    const easyWords = ['the', 'and', 'is', 'in', 'to', 'of', 'a', 'that', 'it', 'with', 'for', 'as', 'was', 'on', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'man', 'oil', 'sit', 'yes', 'yet', 'big', 'eye', 'fly', 'guy', 'hot', 'job', 'lot', 'low', 'mom', 'pop', 'run', 'sun', 'top', 'win', 'zoo']
    const mediumWords = ['about', 'after', 'again', 'before', 'could', 'every', 'first', 'great', 'house', 'little', 'might', 'never', 'other', 'place', 'right', 'small', 'sound', 'still', 'their', 'there', 'these', 'think', 'three', 'under', 'water', 'where', 'which', 'while', 'world', 'would', 'write', 'years', 'young', 'above', 'below', 'between', 'during', 'family', 'friend', 'happen', 'important', 'interest', 'language', 'machine', 'natural', 'nothing', 'problem', 'question', 'remember', 'sentence', 'something', 'sometimes', 'together', 'understand', 'without']
    
    const wordLower = word.toLowerCase()
    
    if (easyWords.includes(wordLower)) return 'easy'
    if (mediumWords.includes(wordLower)) return 'medium'
    return 'hard'
  }

  // Sample translation function (in real app, use translation API)
  const translateWord = async (word: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const translations: { [key: string]: string } = {
      'computer': 'حاسوب',
      'technology': 'تكنولوجيا',
      'science': 'علم',
      'mathematics': 'رياضيات',
      'physics': 'فيزياء',
      'chemistry': 'كيمياء',
      'biology': 'أحياء',
      'engineering': 'هندسة',
      'programming': 'برمجة',
      'algorithm': 'خوارزمية',
      'database': 'قاعدة بيانات',
      'network': 'شبكة',
      'security': 'أمان',
      'software': 'برمجيات',
      'hardware': 'معدات',
      'application': 'تطبيق',
      'system': 'نظام',
      'data': 'بيانات',
      'information': 'معلومات',
      'analysis': 'تحليل',
      'design': 'تصميم',
      'development': 'تطوير',
      'implementation': 'تنفيذ',
      'testing': 'اختبار',
      'maintenance': 'صيانة',
      'documentation': 'توثيق',
      'interface': 'واجهة',
      'architecture': 'هندسة معمارية',
      'framework': 'إطار عمل',
      'library': 'مكتبة',
      'function': 'دالة',
      'variable': 'متغير',
      'constant': 'ثابت',
      'parameter': 'معامل',
      'method': 'طريقة',
      'class': 'فئة',
      'object': 'كائن',
      'instance': 'مثال',
      'inheritance': 'وراثة',
      'polymorphism': 'تعدد الأشكال',
      'encapsulation': 'تغليف',
      'abstraction': 'تجريد'
    }
    
    return translations[word.toLowerCase()] || `ترجمة ${word}`
  }

  // Text-to-speech function
  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  // Process uploaded file
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setIsProcessing(true)
    setIsAnalyzing(true)

    try {
      // Simulate PDF processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Sample extracted words (in real app, extract from PDF)
      const sampleWords = [
        'computer', 'technology', 'science', 'mathematics', 'physics', 'chemistry',
        'biology', 'engineering', 'programming', 'algorithm', 'database', 'network',
        'security', 'software', 'hardware', 'application', 'system', 'data',
        'information', 'analysis', 'design', 'development', 'implementation',
        'testing', 'maintenance', 'documentation', 'interface', 'architecture',
        'framework', 'library', 'function', 'variable', 'constant', 'parameter',
        'method', 'class', 'object', 'instance', 'inheritance', 'polymorphism',
        'encapsulation', 'abstraction', 'programming', 'development', 'analysis'
      ]

      // Process words
      const processedWords: WordData[] = []
      const wordCount: { [key: string]: number } = {}

      // Count word frequency
      sampleWords.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, '')
        if (cleanWord.length > 2) {
          wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1
        }
      })

      // Create word data with translations
      for (const [word, frequency] of Object.entries(wordCount)) {
        const translation = await translateWord(word)
        const difficulty = analyzeDifficulty(word)
        
        processedWords.push({
          word,
          translation,
          difficulty,
          frequency
        })
      }

      // Sort by frequency (most common first)
      processedWords.sort((a, b) => b.frequency - a.frequency)
      
      setWords(processedWords)
    } catch (error) {
      console.error('Error processing file:', error)
    } finally {
      setIsProcessing(false)
      setIsAnalyzing(false)
    }
  }

  const resetPage = () => {
    setWords([])
    setFileName('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/20'
      case 'hard': return 'text-red-400 bg-red-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'سهل'
      case 'medium': return 'متوسط'
      case 'hard': return 'صعب'
      default: return 'غير محدد'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-cyber-neon to-cyber-green rounded-xl flex items-center justify-center shadow-lg shadow-cyber-neon/30">
              <Languages className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100">
              English Helper
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
            Upload your PDF lecture files to extract and learn English vocabulary with pronunciation
          </p>
        </div>

        {/* Upload Section */}
        {words.length === 0 && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="enhanced-card p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-cyber-violet to-cyber-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-semibold text-dark-100 mb-4">
                Upload PDF File
              </h2>
              
              <p className="text-dark-300 mb-6">
                Select a PDF file from your lecture materials to extract English vocabulary
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="pdf-upload"
              />
              
              <label
                htmlFor="pdf-upload"
                className="btn-primary inline-flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-5 h-5" />
                Choose PDF File
              </label>
            </div>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="enhanced-card p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-cyber-neon to-cyber-violet rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
                <Zap className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-semibold text-dark-100 mb-4">
                Processing File...
              </h2>
              
              <p className="text-dark-300 mb-4">
                Extracting text and analyzing vocabulary from: <strong>{fileName}</strong>
              </p>
              
              {isAnalyzing && (
                <div className="flex items-center justify-center gap-2 text-cyber-neon">
                  <div className="w-2 h-2 bg-cyber-neon rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyber-neon rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-cyber-neon rounded-full animate-bounce delay-200"></div>
                  <span className="ml-2">Analyzing word difficulty...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Section */}
        {words.length > 0 && (
          <div className="animate-slide-up">
            {/* Header with controls */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-dark-100 mb-2">
                  Extracted Vocabulary
                </h2>
                <p className="text-dark-300">
                  Found {words.length} unique words from: <strong>{fileName}</strong>
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={resetPage}
                  className="btn-secondary flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  New File
                </button>
              </div>
            </div>

            {/* Words Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {words.map((wordData, index) => (
                <div
                  key={index}
                  className="enhanced-card p-4 hover:scale-105 transition-all duration-300 animate-slide-up-delayed"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-dark-100 mb-1">
                        {wordData.word}
                      </h3>
                      <p className="text-dark-300 text-sm mb-2">
                        {wordData.translation}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => speakWord(wordData.word)}
                      className="btn-tertiary p-2 hover:bg-cyber-neon/20 transition-colors"
                      title="Listen to pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(wordData.difficulty)}`}>
                      {getDifficultyText(wordData.difficulty)}
                    </span>
                    <span className="text-xs text-dark-400">
                      {wordData.frequency}x
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-8 enhanced-card p-6">
              <h3 className="text-lg font-semibold text-dark-100 mb-4">Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {words.filter(w => w.difficulty === 'easy').length}
                  </div>
                  <div className="text-sm text-dark-300">Easy Words</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {words.filter(w => w.difficulty === 'medium').length}
                  </div>
                  <div className="text-sm text-dark-300">Medium Words</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {words.filter(w => w.difficulty === 'hard').length}
                  </div>
                  <div className="text-sm text-dark-300">Hard Words</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
