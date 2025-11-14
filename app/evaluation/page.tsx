'use client'

export default function EvaluationPage() {
  return (
    <div className="courses-page">
      <section className="page-hero">
        <h1>
          📊 <span className="gradient-text">التقييم والأخبار</span>
        </h1>
        <p>تابع آخر الأخبار والتقييمات في مجال الأمن السيبراني</p>
      </section>

      <main className="courses-content">
        <section style={{ marginBottom: '4rem' }}>
          <h2 className="category-title">أحدث الأخبار</h2>
          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-dark)' }}>
            <p style={{ color: 'var(--secondary-gray)', lineHeight: '1.8' }}>
              سيتم إضافة آخر الأخبار والتقييمات قريباً. تابعونا للحصول على التحديثات.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
