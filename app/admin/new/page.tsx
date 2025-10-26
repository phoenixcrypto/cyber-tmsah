import { Upload, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function NewMaterialPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-cyber-neon hover:text-cyber-violet transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة إلى لوحة الإدارة
          </Link>
          
          <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-dark-100 mb-4">
            إضافة مادة جديدة
          </h1>
          <p className="text-lg text-dark-300">
            أضف مادة تعليمية جديدة إلى المنصة
          </p>
        </div>

        {/* Form */}
        <div className="enhanced-card p-8 animate-slide-up">
          <form className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-dark-100 mb-4">
                المعلومات الأساسية
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    عنوان المادة
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 placeholder-dark-400 focus:border-cyber-neon focus:outline-none transition-colors"
                    placeholder="أدخل عنوان المادة"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    نوع المادة
                  </label>
                  <select className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none transition-colors">
                    <option value="">اختر نوع المادة</option>
                    <option value="lecture">محاضرة</option>
                    <option value="assignment">واجب</option>
                    <option value="exam">امتحان</option>
                    <option value="resource">مصدر تعليمي</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  وصف المادة
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 placeholder-dark-400 focus:border-cyber-neon focus:outline-none transition-colors resize-none"
                  placeholder="أدخل وصف المادة"
                ></textarea>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-dark-100 mb-4">
                المحتوى
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  محتوى المادة
                </label>
                <textarea
                  rows={8}
                  className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 placeholder-dark-400 focus:border-cyber-neon focus:outline-none transition-colors resize-none"
                  placeholder="أدخل محتوى المادة"
                ></textarea>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-dark-100 mb-4">
                الإعدادات الإضافية
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    تاريخ الاستحقاق
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    النقاط
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 placeholder-dark-400 focus:border-cyber-neon focus:outline-none transition-colors"
                    placeholder="أدخل عدد النقاط"
                  />
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-dark-100 mb-4">
                المرفقات
              </h3>
              
              <div className="border-2 border-dashed border-cyber-neon/30 rounded-lg p-8 text-center hover:border-cyber-neon/50 transition-colors">
                <Upload className="w-12 h-12 text-cyber-neon mx-auto mb-4" />
                <p className="text-dark-300 mb-2">
                  اسحب وأفلت الملفات هنا أو انقر للاختيار
                </p>
                <p className="text-sm text-dark-400">
                  PNG, JPG, PDF, DOC, DOCX حتى 10MB
                </p>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="btn-secondary mt-4 cursor-pointer"
                >
                  اختيار الملفات
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-cyber-neon/20">
              <button
                type="submit"
                className="btn-primary flex items-center justify-center gap-2 flex-1"
              >
                <Save className="w-4 h-4" />
                حفظ المادة
              </button>
              
              <Link
                href="/admin"
                className="btn-secondary flex items-center justify-center gap-2 flex-1"
              >
                <ArrowLeft className="w-4 h-4" />
                إلغاء
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}