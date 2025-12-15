import { NextRequest, NextResponse } from 'next/server'

interface GenerateDescriptionRequest {
  title: string
  type: 'material' | 'page' | 'article' | 'download' | 'news'
  language?: 'ar' | 'en'
}

// Simple AI-like description generator based on title
function generateDescription(title: string, type: string, language: 'ar' | 'en' = 'ar'): string {
  // Arabic descriptions
  if (language === 'ar') {
    const descriptions: Record<string, string[]> = {
      material: [
        `مادة ${title} هي مادة دراسية متخصصة تهدف إلى تزويد الطلاب بالمعرفة والمهارات الأساسية في مجال ${title}. تشمل هذه المادة محتوى تعليمي شامل يغطي المفاهيم الأساسية والتطبيقات العملية.`,
        `تقدم مادة ${title} للطلاب فرصة فريدة للتعمق في مجال ${title} من خلال محتوى تعليمي منظم ومنهجي. تركز المادة على الجوانب النظرية والعملية لضمان فهم شامل للموضوع.`,
        `مادة ${title} مصممة خصيصاً لتلبية احتياجات الطلاب المهتمين بدراسة ${title}. تشمل المادة مجموعة متنوعة من المواضيع والأنشطة التعليمية التي تساعد في بناء قاعدة معرفية قوية.`,
      ],
      page: [
        `صفحة ${title} تقدم معلومات شاملة ومفصلة حول ${title}. تحتوي هذه الصفحة على محتوى غني ومنظم يغطي جميع الجوانب المهمة المتعلقة بالموضوع.`,
        `في صفحة ${title}، ستجد محتوى تعليمي وتثقيفي شامل حول ${title}. تم تصميم هذه الصفحة لتوفير معلومات دقيقة ومفيدة للزوار.`,
        `صفحة ${title} مصممة لتكون مصدراً موثوقاً للمعلومات حول ${title}. تحتوي على محتوى منظم وسهل الفهم يلبي احتياجات القراء.`,
      ],
      article: [
        `مقال ${title} يقدم تحليلاً شاملاً ودراسة متعمقة لموضوع ${title}. يغطي المقال الجوانب المختلفة للموضوع مع أمثلة عملية وتطبيقات واقعية.`,
        `في هذا المقال حول ${title}، سنستكشف المفاهيم الأساسية والتطبيقات العملية. المقال مصمم لتقديم معلومات قيمة وحديثة للقراء المهتمين بالموضوع.`,
        `مقال ${title} يسلط الضوء على أهم الجوانب المتعلقة بـ ${title}. يحتوي على معلومات دقيقة ومحدثة مع أمثلة توضيحية لتسهيل الفهم.`,
      ],
      download: [
        `برنامج ${title} هو أداة متقدمة مصممة لمساعدتك في ${title}. يوفر البرنامج ميزات قوية وسهلة الاستخدام لتحسين إنتاجيتك وكفاءتك.`,
        `${title} هو تطبيق احترافي يوفر حلولاً متكاملة في مجال ${title}. يتميز بواجهة مستخدم سهلة وميزات متقدمة تلبي احتياجات المستخدمين.`,
        `برنامج ${title} مصمم خصيصاً لتلبية احتياجات المستخدمين في ${title}. يقدم البرنامج أدوات قوية وحديثة لتحسين الأداء والكفاءة.`,
      ],
      news: [
        `خبر ${title} يغطي آخر التطورات والأحداث المتعلقة بـ ${title}. يقدم الخبر معلومات دقيقة ومحدثة مع تحليل شامل للوضع الحالي.`,
        `في خبر ${title}، نستعرض أهم الأحداث والتطورات الجديدة. الخبر يحتوي على معلومات موثقة وتحليل مفصل للموضوع.`,
        `خبر ${title} يسلط الضوء على التطورات الأخيرة في ${title}. يقدم معلومات شاملة مع تحليل دقيق للآثار والنتائج.`,
      ],
    }
    
    const typeDescriptions = descriptions[type] || descriptions['material']
    if (!typeDescriptions || typeDescriptions.length === 0) {
      return `وصف ${title}`
    }
    const randomIndex = Math.floor(Math.random() * typeDescriptions.length)
    return typeDescriptions[randomIndex] || `وصف ${title}`
  } else {
    // English descriptions
    const descriptions: Record<string, string[]> = {
      material: [
        `${title} is a specialized course designed to provide students with fundamental knowledge and skills in ${title}. This course includes comprehensive educational content covering basic concepts and practical applications.`,
        `The ${title} course offers students a unique opportunity to delve into ${title} through organized and systematic educational content. The course focuses on both theoretical and practical aspects to ensure comprehensive understanding.`,
        `${title} is specifically designed to meet the needs of students interested in studying ${title}. The course includes a variety of topics and educational activities that help build a strong knowledge base.`,
      ],
      page: [
        `The ${title} page provides comprehensive and detailed information about ${title}. This page contains rich and organized content covering all important aspects of the topic.`,
        `On the ${title} page, you will find comprehensive educational and informative content about ${title}. This page is designed to provide accurate and useful information for visitors.`,
        `The ${title} page is designed to be a reliable source of information about ${title}. It contains organized and easy-to-understand content that meets readers' needs.`,
      ],
      article: [
        `The article ${title} provides a comprehensive analysis and in-depth study of ${title}. The article covers various aspects of the topic with practical examples and real-world applications.`,
        `In this article about ${title}, we will explore the fundamental concepts and practical applications. The article is designed to provide valuable and up-to-date information for readers interested in the topic.`,
        `The article ${title} highlights the most important aspects related to ${title}. It contains accurate and updated information with illustrative examples to facilitate understanding.`,
      ],
      download: [
        `${title} is an advanced tool designed to help you with ${title}. The software provides powerful and easy-to-use features to improve your productivity and efficiency.`,
        `${title} is a professional application that provides integrated solutions in ${title}. It features an easy-to-use interface and advanced features that meet users' needs.`,
        `${title} is specifically designed to meet users' needs in ${title}. The software offers powerful and modern tools to improve performance and efficiency.`,
      ],
      news: [
        `The news ${title} covers the latest developments and events related to ${title}. The news provides accurate and updated information with comprehensive analysis of the current situation.`,
        `In the news ${title}, we review the most important events and new developments. The news contains documented information and detailed analysis of the topic.`,
        `The news ${title} highlights recent developments in ${title}. It provides comprehensive information with accurate analysis of effects and results.`,
      ],
    }
    
    const typeDescriptions = descriptions[type] || descriptions['material']
    if (!typeDescriptions || typeDescriptions.length === 0) {
      return `وصف ${title}`
    }
    const randomIndex = Math.floor(Math.random() * typeDescriptions.length)
    return typeDescriptions[randomIndex] || `وصف ${title}`
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateDescriptionRequest = await request.json()
    const { title, type, language = 'ar' } = body

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'العنوان مطلوب لتوليد الوصف' },
        { status: 400 }
      )
    }

    if (!type) {
      return NextResponse.json(
        { error: 'نوع المحتوى مطلوب' },
        { status: 400 }
      )
    }

    const description = generateDescription(title.trim(), type, language)

    return NextResponse.json({
      success: true,
      description,
    })
  } catch (error) {
    console.error('Error generating description:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء توليد الوصف' },
      { status: 500 }
    )
  }
}

