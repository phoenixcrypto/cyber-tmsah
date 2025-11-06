'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { parseExcelFile, type StudentRow } from '@/lib/utils/excelParser'

export default function VerificationUploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [parsedData, setParsedData] = useState<StudentRow[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState('')
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [uploadResult, setUploadResult] = useState<{
    success: number
    failed: number
    errors: string[]
  } | null>(null)

  // التحقق من أن المستخدم admin عند تحميل الصفحة
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // محاولة الحصول على access_token من cookies
        const cookies = document.cookie.split(';')
        const accessTokenCookie = cookies.find(c => c.trim().startsWith('access_token='))
        const accessToken = accessTokenCookie?.split('=')[1]

        if (!accessToken) {
          router.push('/login?redirect=/admin/verification')
          return
        }

        // فك تشفير JWT للتحقق من الـ role
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1] || ''))
          if (payload.role === 'admin') {
            setIsAdmin(true)
          } else {
            setErrors(['Admin access required. Please log in as an administrator.'])
            setIsAdmin(false)
          }
        } catch (e) {
          setErrors(['Invalid token. Please log in again.'])
          setIsAdmin(false)
        }
      } catch (err) {
        setErrors(['Failed to verify admin access. Please log in again.'])
        setIsAdmin(false)
      }
    }

    checkAdmin()
  }, [router])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type
    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls') && !selectedFile.name.endsWith('.csv')) {
      setErrors(['Please select an Excel file (.xlsx, .xls) or CSV file'])
      return
    }

    setFile(selectedFile)
    setErrors([])
    setSuccess('')
    setParsedData([])
    setUploadResult(null)

    // Parse file
    setParsing(true)
    try {
      const result = await parseExcelFile(selectedFile)
      
      if (result.success && result.data.length > 0) {
        setParsedData(result.data)
        if (result.errors.length > 0) {
          setErrors(result.errors)
        }
        setSuccess(`Successfully parsed ${result.data.length} students`)
      } else {
        setErrors(result.errors.length > 0 ? result.errors : ['Failed to parse file. Please check the format.'])
      }
    } catch (err) {
      setErrors([`Error parsing file: ${err instanceof Error ? err.message : 'Unknown error'}`])
    } finally {
      setParsing(false)
    }
  }

  const handleUpload = async () => {
    if (!parsedData.length) {
      setErrors(['Please select and parse a file first'])
      return
    }

    setUploading(true)
    setErrors([])
    setSuccess('')
    setUploadResult(null)

    try {
      // قراءة access_token من الكوكيز لإرساله أيضاً في Authorization كحل احتياطي
      const accessTokenCookie = document.cookie.split(';').find(c => c.trim().startsWith('access_token='))
      const accessToken = accessTokenCookie?.split('=')[1]

      const response = await fetch('/api/admin/verification/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        credentials: 'include', // إرسال cookies (access_token) تلقائياً
        body: JSON.stringify({ students: parsedData }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setUploadResult({
          success: data.successCount || 0,
          failed: data.failedCount || 0,
          errors: data.errors || [],
        })
        setSuccess(`Successfully uploaded ${data.successCount || 0} students`)
        setParsedData([])
        setFile(null)
        
        // Reset file input
        const fileInput = document.getElementById('excel-file') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      } else {
        setErrors([data.error || 'Upload failed. Please try again.'])
      }
    } catch (err) {
      setErrors([`Error uploading: ${err instanceof Error ? err.message : 'Unknown error'}`])
    } finally {
      setUploading(false)
    }
  }

  // إخفاء المحتوى حتى يتم التحقق من صلاحيات admin
  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyber-neon mx-auto mb-4" />
          <p className="text-dark-300">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    )
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark-100 mb-2">غير مصرح بالوصول</h2>
          <p className="text-dark-300 mb-4">يجب تسجيل الدخول كمسؤول للوصول إلى هذه الصفحة.</p>
          <button
            onClick={() => router.push('/login?redirect=/admin/verification')}
            className="px-6 py-2 bg-cyber-neon text-cyber-dark rounded-lg font-semibold hover:bg-cyber-neon/80 transition-colors"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-dark-100 mb-2">
            Upload Verification List
          </h1>
          <p className="text-dark-300">
            Upload Excel file with student information (703 students)
          </p>
        </div>

        {/* Upload Section */}
        <div className="enhanced-card p-8 mb-8 animate-slide-up">
          <div className="mb-6">
            <label className="block text-sm font-medium text-dark-300 mb-4">
              Excel File Format:
            </label>
            <div className="bg-cyber-dark/50 p-4 rounded-lg border border-cyber-neon/20">
              <p className="text-dark-300 text-sm mb-2">
                Required columns:
              </p>
              <ul className="list-disc list-inside text-dark-400 text-sm space-y-1">
                <li>Full Name</li>
                <li>Section Number (1-15)</li>
                <li>Group (Group 1 or Group 2)</li>
                <li>Student ID (optional)</li>
                <li>Email (optional)</li>
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="excel-file"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-cyber-neon/30 rounded-lg cursor-pointer bg-cyber-dark/50 hover:bg-cyber-dark/70 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {parsing ? (
                  <Loader2 className="w-12 h-12 text-cyber-neon animate-spin mb-4" />
                ) : (
                  <FileSpreadsheet className="w-12 h-12 text-cyber-neon mb-4" />
                )}
                <p className="mb-2 text-sm text-dark-300">
                  {parsing ? (
                    <span>Parsing file...</span>
                  ) : file ? (
                    <span className="font-medium">{file.name}</span>
                  ) : (
                    <span className="font-medium">Click to upload Excel file</span>
                  )}
                </p>
                <p className="text-xs text-dark-400">
                  Excel (.xlsx, .xls) or CSV
                </p>
              </div>
              <input
                id="excel-file"
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                disabled={parsing}
              />
            </label>
          </div>

          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-red-400 font-semibold mb-2">Errors:</h4>
                  <ul className="list-disc list-inside text-red-300 text-sm space-y-1">
                    {errors.slice(0, 10).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                    {errors.length > 10 && (
                      <li className="text-red-400">... and {errors.length - 10} more errors</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-cyber-green/20 border border-cyber-green/50 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyber-green flex-shrink-0 mt-0.5" />
              <p className="text-cyber-green text-sm">{success}</p>
            </div>
          )}

          {parsedData.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-dark-100">
                  Parsed Students: {parsedData.length}
                </h3>
                <button
                  onClick={() => {
                    setParsedData([])
                    setFile(null)
                    setErrors([])
                    setSuccess('')
                    const fileInput = document.getElementById('excel-file') as HTMLInputElement
                    if (fileInput) fileInput.value = ''
                  }}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Clear
                </button>
              </div>
              
              <div className="max-h-64 overflow-y-auto border border-cyber-neon/20 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-cyber-dark/50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-dark-300">Full Name</th>
                      <th className="px-4 py-2 text-left text-dark-300">Section</th>
                      <th className="px-4 py-2 text-left text-dark-300">Group</th>
                      <th className="px-4 py-2 text-left text-dark-300">Student ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.slice(0, 20).map((student, index) => (
                      <tr key={index} className="border-t border-cyber-neon/10">
                        <td className="px-4 py-2 text-dark-200">{student.fullName}</td>
                        <td className="px-4 py-2 text-dark-300">{student.sectionNumber}</td>
                        <td className="px-4 py-2 text-dark-300">{student.groupName}</td>
                        <td className="px-4 py-2 text-dark-400">{student.studentId || '-'}</td>
                      </tr>
                    ))}
                    {parsedData.length > 20 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-2 text-center text-dark-400 text-sm">
                          ... and {parsedData.length - 20} more students
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {uploadResult && (
            <div className="mb-6 p-4 bg-cyber-dark/50 border border-cyber-neon/30 rounded-lg">
              <h4 className="text-dark-100 font-semibold mb-2">Upload Result:</h4>
              <div className="space-y-2 text-sm">
                <p className="text-cyber-green">
                  ✓ Successfully uploaded: {uploadResult.success} students
                </p>
                {uploadResult.failed > 0 && (
                  <p className="text-red-400">
                    ✗ Failed: {uploadResult.failed} students
                  </p>
                )}
                {uploadResult.errors.length > 0 && (
                  <div className="mt-4">
                    <p className="text-red-400 font-semibold mb-2">Errors:</p>
                    <ul className="list-disc list-inside text-red-300 space-y-1">
                      {uploadResult.errors.slice(0, 5).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                      {uploadResult.errors.length > 5 && (
                        <li>... and {uploadResult.errors.length - 5} more errors</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading || !parsedData.length}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload {parsedData.length} Students to Verification List
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

