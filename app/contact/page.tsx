import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: 'info@cyber-tmsah.com',
      description: 'راسلنا على البريد الإلكتروني'
    },
    {
      icon: Phone,
      title: 'الهاتف',
      value: '+966 50 123 4567',
      description: 'اتصل بنا مباشرة'
    },
    {
      icon: MapPin,
      title: 'العنوان',
      value: 'الرياض، المملكة العربية السعودية',
      description: 'زيارتنا في المقر الرئيسي'
    },
    {
      icon: Clock,
      title: 'ساعات العمل',
      value: 'الأحد - الخميس: 8:00 - 17:00',
      description: 'نحن متاحون خلال ساعات العمل'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100 mb-6">
            اتصل بنا
          </h1>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
            نحن هنا لمساعدتك. تواصل معنا لأي استفسار أو دعم
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-slide-up">
          {contactInfo.map((info, index) => {
            const Icon = info.icon
            return (
              <div
                key={index}
                className="enhanced-card p-6 text-center hover:scale-105 transition-all duration-300 animate-slide-up-delayed"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-cyber-neon to-cyber-green rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-cyber-dark" />
                </div>
                <h3 className="text-xl font-semibold text-dark-100 mb-2">
                  {info.title}
                </h3>
                <p className="text-cyber-neon font-medium mb-2">
                  {info.value}
                </p>
                <p className="text-dark-300 text-sm">
                  {info.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-slide-up">
          {/* Form */}
          <div className="enhanced-card p-8">
            <h2 className="text-2xl font-semibold text-dark-100 mb-6">
              أرسل لنا رسالة
            </h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    الاسم الأول
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 placeholder-dark-400 focus:border-cyber-neon focus:outline-none transition-colors"
                    placeholder="أدخل اسمك الأول"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    الاسم الأخير
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 placeholder-dark-400 focus:border-cyber-neon focus:outline-none transition-colors"
                    placeholder="أدخل اسمك الأخير"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 placeholder-dark-400 focus:border-cyber-neon focus:outline-none transition-colors"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  الموضوع
                </label>
                <select className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none transition-colors">
                  <option value="">اختر الموضوع</option>
                  <option value="support">دعم فني</option>
                  <option value="general">استفسار عام</option>
                  <option value="feedback">ملاحظات</option>
                  <option value="partnership">شراكة</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  الرسالة
                </label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 placeholder-dark-400 focus:border-cyber-neon focus:outline-none transition-colors resize-none"
                  placeholder="أدخل رسالتك هنا..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                إرسال الرسالة
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="space-y-8">
            <div className="enhanced-card p-8">
              <h3 className="text-xl font-semibold text-dark-100 mb-4">
                لماذا تتواصل معنا؟
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-cyber-neon mt-1" />
                  <div>
                    <h4 className="text-dark-100 font-medium mb-1">
                      الدعم الفني
                    </h4>
                    <p className="text-dark-300 text-sm">
                      نحن هنا لمساعدتك في حل أي مشاكل تقنية
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-cyber-violet mt-1" />
                  <div>
                    <h4 className="text-dark-100 font-medium mb-1">
                      الاستفسارات العامة
                    </h4>
                    <p className="text-dark-300 text-sm">
                      أجوبة على جميع استفساراتك حول المنصة
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-cyber-green mt-1" />
                  <div>
                    <h4 className="text-dark-100 font-medium mb-1">
                      الملاحظات والاقتراحات
                    </h4>
                    <p className="text-dark-300 text-sm">
                      نرحب بملاحظاتك لتحسين تجربتك
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="enhanced-card p-8">
              <h3 className="text-xl font-semibold text-dark-100 mb-4">
                أوقات الاستجابة
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">البريد الإلكتروني</span>
                  <span className="text-cyber-neon font-medium">24 ساعة</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">الهاتف</span>
                  <span className="text-cyber-neon font-medium">فوري</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">الدعم الفني</span>
                  <span className="text-cyber-neon font-medium">4 ساعات</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}