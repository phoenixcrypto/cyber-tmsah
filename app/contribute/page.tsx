'use client'

export default function ContributePage() {
  return (
    <div className="courses-page">
      <section className="page-hero">
        <h1>
          📚 <span className="gradient-text">المساهمة بالمصادر</span>
        </h1>
        <p>ساهم معنا في إثراء المحتوى التعليمي العربي في مجال الأمن السيبراني من خلال إضافة مصادر جديدة ومفيدة.</p>
      </section>

      <main className="courses-content">
        <section style={{ marginBottom: '4rem' }}>
          <h2 className="category-title">المصادر التعليمية الرئيسية</h2>
          <div className="courses-grid">
            <div className="course-card">
              <div className="course-thumbnail" style={{ fontSize: '3rem' }}>🎓</div>
              <div className="course-info">
                <h4>الدورات التعليمية</h4>
                <p className="course-description">ساهم بإضافة دورات تعليمية جديدة في مختلف مجالات الأمن السيبراني</p>
              </div>
            </div>
            <div className="course-card">
              <div className="course-thumbnail" style={{ fontSize: '3rem' }}>📖</div>
              <div className="course-info">
                <h4>الكتب</h4>
                <p className="course-description">أضف كتباً قيمة ومفيدة للمتعلمين في مجال الأمن السيبراني</p>
              </div>
            </div>
            <div className="course-card">
              <div className="course-thumbnail" style={{ fontSize: '3rem' }}>🎬</div>
              <div className="course-info">
                <h4>الفيديوهات المقترحة</h4>
                <p className="course-description">شارك فيديوهات تعليمية مفيدة من يوتيوب وقنوات أخرى</p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '4rem' }}>
          <h2 className="category-title">كيفية المساهمة</h2>
          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-dark)' }}>
            <p style={{ color: 'var(--secondary-gray)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              للمساهمة، يرجى التواصل معنا عبر البريد الإلكتروني أو من خلال النموذج في صفحة الاتصال.
            </p>
            <a href="/#contact" className="course-link">
              تواصل معنا
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
