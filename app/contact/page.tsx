import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: 'قريباً',
      description: 'راسلنا على البريد الإلكتروني'
    },
    {
      icon: Phone,
      title: 'الهاتف',
      value: 'قريباً',
      description: 'اتصل بنا مباشرة'
    },
    {
      icon: MapPin,
      title: 'العنوان',
      value: 'قريباً',
      description: 'زيارتنا في المقر الرئيسي'
    },
    {
      icon: Clock,
      title: 'ساعات العمل',
      value: 'طوال الأسبوع',
      description: 'نحن متاحون على مدار الساعة'
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

        {/* Additional Info */}
        <div className="max-w-4xl mx-auto animate-slide-up">
          <div className="enhanced-card p-8 text-center">
            <h3 className="text-2xl font-semibold text-dark-100 mb-6">
              لماذا تتواصل معنا؟
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-right">
                <h4 className="text-xl font-semibold text-dark-100 mb-4">
                  الدعم الفني
                </h4>
                <p className="text-dark-300 leading-relaxed">
                  نحن هنا لمساعدتك في حل أي مشاكل تقنية قد تواجهها أثناء استخدام المنصة. 
                  فريقنا الفني متاح لمساعدتك في أي وقت.
                </p>
              </div>
              
              <div className="text-right">
                <h4 className="text-xl font-semibold text-dark-100 mb-4">
                  الاستفسارات العامة
                </h4>
                <p className="text-dark-300 leading-relaxed">
                  لديك استفسار حول المنصة أو تريد معرفة المزيد عن خدماتنا؟ 
                  نحن سعداء للإجابة على جميع استفساراتك.
                </p>
              </div>
              
              <div className="text-right">
                <h4 className="text-xl font-semibold text-dark-100 mb-4">
                  الملاحظات والاقتراحات
                </h4>
                <p className="text-dark-300 leading-relaxed">
                  نرحب بملاحظاتك واقتراحاتك لتحسين تجربتك. 
                  آراؤك مهمة لنا وتساعدنا في تطوير المنصة.
                </p>
              </div>
              
              <div className="text-right">
                <h4 className="text-xl font-semibold text-dark-100 mb-4">
                  الشراكات والتعاون
                </h4>
                <p className="text-dark-300 leading-relaxed">
                  تريد التعاون معنا أو لديك فكرة مشروع مشترك؟ 
                  نحن متحمسون لسماع أفكارك ومقترحاتك.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}