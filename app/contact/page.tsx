import { Mail, Phone, MapPin, Clock, MessageCircle, User, Code, Award, HeadphonesIcon, HelpCircle, MessageSquare, Users } from 'lucide-react'

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

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent('مرحباً! أريد التواصل معكم حول منصة Cyber TMSAH')
    const whatsappUrl = `https://wa.me/201234567890?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <MessageCircle className="w-8 h-8 text-cyber-neon" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100">
              اتصل بنا
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
            نحن هنا لمساعدتك. تواصل معنا لأي استفسار أو دعم
          </p>
        </div>

        {/* Developer Card */}
        <div className="max-w-4xl mx-auto mb-16 animate-slide-up">
          <div className="enhanced-card p-8 text-center">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-cyber-neon via-cyber-violet to-cyber-green rounded-full flex items-center justify-center shadow-lg shadow-cyber-neon/30">
                  <User className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="flex-1 text-right">
                <h2 className="text-3xl font-orbitron font-bold text-dark-100 mb-4">
                  ZEYAD MOHAMED
                </h2>
                <p className="text-xl text-cyber-neon mb-4">مطور ومصمم المنصة</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-end mb-6">
                  <div className="flex items-center gap-2 text-dark-300">
                    <Code className="w-5 h-5 text-cyber-green" />
                    <span>مطور Full Stack</span>
                  </div>
                  <div className="flex items-center gap-2 text-dark-300">
                    <Award className="w-5 h-5 text-cyber-violet" />
                    <span>مصمم UI/UX</span>
                  </div>
                </div>
                <p className="text-dark-300 leading-relaxed mb-6">
                  مطور شغوف بالتكنولوجيا والتعليم، متخصص في تطوير تطبيقات الويب الحديثة 
                  وتصميم تجارب مستخدم متميزة. أسعى دائماً لتحسين تجربة التعلم من خلال التكنولوجيا.
                </p>
                <button
                  onClick={handleWhatsAppContact}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-3 mx-auto transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/30"
                >
                  <MessageCircle className="w-5 h-5" />
                  تواصل عبر واتساب
                </button>
              </div>
            </div>
          </div>
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
            <div className="flex items-center justify-center gap-3 mb-6">
              <HelpCircle className="w-6 h-6 text-cyber-neon" />
              <h3 className="text-2xl font-semibold text-dark-100">
                لماذا تتواصل معنا؟
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-right">
                <div className="flex items-center gap-2 mb-4">
                  <HeadphonesIcon className="w-5 h-5 text-cyber-green" />
                  <h4 className="text-xl font-semibold text-dark-100">
                    الدعم الفني
                  </h4>
                </div>
                <p className="text-dark-300 leading-relaxed">
                  نحن هنا لمساعدتك في حل أي مشاكل تقنية قد تواجهها أثناء استخدام المنصة. 
                  فريقنا الفني متاح لمساعدتك في أي وقت.
                </p>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="w-5 h-5 text-cyber-violet" />
                  <h4 className="text-xl font-semibold text-dark-100">
                    الاستفسارات العامة
                  </h4>
                </div>
                <p className="text-dark-300 leading-relaxed">
                  لديك استفسار حول المنصة أو تريد معرفة المزيد عن خدماتنا؟ 
                  نحن سعداء للإجابة على جميع استفساراتك.
                </p>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-cyber-blue" />
                  <h4 className="text-xl font-semibold text-dark-100">
                    الملاحظات والاقتراحات
                  </h4>
                </div>
                <p className="text-dark-300 leading-relaxed">
                  نرحب بملاحظاتك واقتراحاتك لتحسين تجربتك. 
                  آراؤك مهمة لنا وتساعدنا في تطوير المنصة.
                </p>
              </div>
              
              <div className="text-right">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-cyber-neon" />
                    <h4 className="text-xl font-semibold text-dark-100">
                      الشراكات والتعاون
                    </h4>
                  </div>
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