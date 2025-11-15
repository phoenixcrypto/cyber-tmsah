'use client'

export default function ExpertiseGuidePage() {
  return (
    <div className="courses-page">
      <section className="page-hero">
        <h1>
          💼 <span className="gradient-text">دليل المهارات المهنية والتجارب العملية</span>
        </h1>
        <p>تعلم من تجارب المحترفين في مجال الأمن السيبراني. نصائح عملية، أخطاء شائعة، وطرق تجنبها من خبراء ميدانيين.</p>
      </section>

      <main className="courses-content">
        <section style={{ marginBottom: '4rem' }}>
          <h2 className="category-title">نصائح للمبتدئين</h2>
          <div className="courses-grid">
            <div className="course-card">
              <div className="course-thumbnail" style={{ fontSize: '3rem' }}>👨‍💻</div>
              <div className="course-info">
                <h4>أحمد محمود</h4>
                <p className="course-instructor">محلل أمني - ٦ سنوات خبرة</p>
                <p className="course-description">
                  "أكبر خطأ ارتكبته في بدايتي هو القفز مباشرة إلى الأدوات المتقدمة دون فهم الأساسيات. أنصح كل مبتدئ بأن يبدأ بتعلم الشبكات وأنظمة التشغيل جيداً، ثم ينتقل إلى الأدوات."
                </p>
                <div className="course-tags">
                  <span className="course-tag">أساسيات</span>
                  <span className="course-tag">مسار تعليمي</span>
                </div>
              </div>
            </div>
            <div className="course-card">
              <div className="course-thumbnail" style={{ fontSize: '3rem' }}>👩‍🎓</div>
              <div className="course-info">
                <h4>فاطمة عبدالرحمن</h4>
                <p className="course-instructor">مهندسة أمن - ٤ سنوات خبرة</p>
                <p className="course-description">
                  "لا تخف من ارتكاب الأخطاء في المختبرات. كل خطأ هو فرصة للتعلم. أنشئ مختبرك الخاص وكرر التجارب حتى تفهم تماماً ما يحدث."
                </p>
                <div className="course-tags">
                  <span className="course-tag">مختبرات</span>
                  <span className="course-tag">تعلم عملي</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
