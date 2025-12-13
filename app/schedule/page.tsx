'use client'

import { Calendar, Clock, MapPin, User, Search, BookOpen, FlaskConical, PartyPopper, AlertTriangle } from 'lucide-react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import PageHeader from '@/components/PageHeader'
import { seedScheduleLectures, seedScheduleSections } from '@/lib/seed-data/schedule'
import type { ScheduleItem } from '@/lib/types'

export default function SchedulePage() {
  const { t } = useLanguage()
  const [selectedSection, setSelectedSection] = useState('')
  const [validationError, setValidationError] = useState('')
  const [scheduleView, setScheduleView] = useState<'A' | 'B'>('A') // Toggle between Group A and B
  const [allScheduleData, setAllScheduleData] = useState<ScheduleItem[]>([])

  // Fetch schedule data from API
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const res = await fetch('/api/schedule')
        const data = await res.json()
        setAllScheduleData(data.items || [])
      } catch (error) {
        console.error('Error fetching schedule:', error)
        // Fallback to empty array
        setAllScheduleData([])
      }
    }
    fetchScheduleData()
  }, [])

  // Convert seed data to ScheduleItem format
  const sectionsData: ScheduleItem[] = seedScheduleSections.map(item => ({
    ...item,
    day: item.day as ScheduleItem['day'],
    group: item.group as ScheduleItem['group'],
  }))
  const scheduleData: ScheduleItem[] = seedScheduleLectures.map(item => ({
    ...item,
    day: item.day as ScheduleItem['day'],
    group: item.group as ScheduleItem['group'],
  }))

  // Validation function
  const validateGroupAndSection = useCallback((group: string, section: string): string => {
    if (!group || !section) return ''
    
    const sectionNum = parseInt(section)
    
    // Group A (Group 1) → Sections 1-7 only
    if (group === 'Group 1') {
      if (sectionNum < 1 || sectionNum > 7) {
        return t('schedule.groupA.sections')
      }
    }
    
    // Group B (Group 2) → Sections 8-15 only
    if (group === 'Group 2') {
      if (sectionNum < 8 || sectionNum > 15) {
        return t('schedule.groupB.sections')
      }
    }
    
    return ''
  }, [t])

  const sections = Array.from({length: 15}, (_, i) => i + 1);
  
  // Period times mapping (8 periods) - defined first as it's used in other computations
  const periods = useMemo(() => [
    { number: 1, time: '09:00 AM - 10:00 AM', start: '09:00' },
    { number: 2, time: '10:10 AM - 11:10 AM', start: '10:10' },
    { number: 3, time: '11:20 AM - 12:20 PM', start: '11:20' },
    { number: 4, time: '12:30 PM - 01:30 PM', start: '12:30' },
    { number: 5, time: '01:40 PM - 02:40 PM', start: '01:40' },
    { number: 6, time: '02:50 PM - 03:50 PM', start: '02:50' },
    { number: 7, time: '04:00 PM - 05:00 PM', start: '04:00' },
    { number: 8, time: '05:10 PM - 06:10 PM', start: '05:10' }
  ], []);
  
  // Convert time string to period number
  const getPeriodFromTime = useCallback((timeStr: string): number => {
    if (!timeStr) return 0
    const startTime = timeStr.split(' - ')[0] || ''
    // Normalize time format (handle AM/PM)
    let normalizedTime = startTime.trim()
    if (normalizedTime.includes('AM') || normalizedTime.includes('PM')) {
      normalizedTime = normalizedTime.replace(' AM', '').replace(' PM', '')
    }
    normalizedTime = normalizedTime.trim()
    
    // Match exact period start time
    for (const period of periods) {
      if (normalizedTime === period.start) {
        return period.number
      }
    }
    
    return 0
  }, [periods]);
  
  // Use API data if available, otherwise fallback to hardcoded
  const allScheduleDataMemo = useMemo(() => {
    if (allScheduleData.length > 0) {
      return allScheduleData
    }
    // Fallback to hardcoded data during migration
    return [...scheduleData, ...sectionsData]
  }, [allScheduleData, scheduleData, sectionsData])

  // Compute derived values
  const groupFilter = useMemo(() => {
    return scheduleView === 'A' ? 'Group 1' : 'Group 2';
  }, [scheduleView]);

  const lecturesForGroup = useMemo(() => {
    return allScheduleDataMemo.filter(item => item.group === groupFilter && !item.sectionNumber)
  }, [allScheduleDataMemo, groupFilter])

  const labsForSelectedSection = useMemo(() => {
    if (!selectedSection) return []
    return allScheduleDataMemo.filter(item => item.group === groupFilter && item.sectionNumber === parseInt(selectedSection) && item.type === 'lab')
  }, [allScheduleDataMemo, selectedSection, groupFilter])

  const scheduleCards = useMemo(() => {
    if (!selectedSection) return []
    return [...lecturesForGroup, ...labsForSelectedSection]
  }, [lecturesForGroup, labsForSelectedSection, selectedSection])
  
  const handleSearch = () => {
    // Filter by selected group (A or B) from toggle
    
    // If section is selected, validate it
    if (selectedSection) {
      const error = validateGroupAndSection(groupFilter, selectedSection)
      if (error) {
        setValidationError(error)
        return
      }
    }
    
    // Clear error if validation passes
    setValidationError('')
    
    let filtered = allScheduleDataMemo.filter(item => {
      const matchesGroup = item.group === groupFilter
      // If section is selected: show ONLY that section's labs (no lectures)
      // If no section selected: show all sections and lectures
      if (selectedSection) {
        // Include ONLY: labs for the selected section (exclude lectures)
        return matchesGroup && item.sectionNumber === parseInt(selectedSection)
      } else {
        // Include: all items in the group
        return matchesGroup
      }
    })
    
    // Sort by day order and then by time
    const dayOrder = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    filtered.sort((a, b) => {
      const dayA = dayOrder.indexOf(a.day || '')
      const dayB = dayOrder.indexOf(b.day || '')
      if (dayA !== dayB) return dayA - dayB
      
      // If same day, sort by time
      const timeA = a.time.split(' - ')[0] || ''
      const timeB = b.time.split(' - ')[0] || ''
      return timeA.localeCompare(timeB)
    })
  }

  // Group schedule by day
  const groupByDay = (items: ScheduleItem[]) => {
    const grouped: Record<string, ScheduleItem[]> = {}
    items.forEach(item => {
      const day = item.day || 'Other'
      if (!grouped[day]) {
        grouped[day] = []
      }
      grouped[day].push(item)
    })
    return grouped
  }

  // Auto-filter when scheduleView or selectedSection changes
  useEffect(() => {
    if (selectedSection) {
      handleSearch()
    } else {
      setValidationError('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleView, selectedSection])

  return (
    <div className="page-container">
      <PageHeader 
        title={t('schedule.title')} 
        icon={Calendar}
        description={t('schedule.description')}
      />

        {/* Schedule View Toggle - Group A or B */}
        <div className="mb-6 animate-slide-up">
          <div className="enhanced-card p-6">
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-xl font-semibold text-dark-100 text-center">
                {t('schedule.chooseView')}
              </h2>
              
              {/* Toggle Switch */}
              <div className="flex items-center gap-4">
                <span className={`text-lg font-semibold transition-colors ${scheduleView === 'A' ? 'text-cyber-neon' : 'text-dark-400'}`}>
                  {t('schedule.groupA')}
                </span>
                
                <button
                  onClick={() => setScheduleView(scheduleView === 'A' ? 'B' : 'A')}
                  className={`switch-track switch-track--compact ${
                    scheduleView === 'A' ? 'switch-track--active' : 'switch-track--inactive'
                  }`}
                  aria-label={scheduleView === 'A' ? 'Group A' : 'Group B'}
                  type="button"
                >
                  <span className="switch-knob" />
                </button>
                
                <span className={`text-lg font-semibold transition-colors ${scheduleView === 'B' ? 'text-cyber-violet' : 'text-dark-400'}`}>
                  {t('schedule.groupB')}
                </span>
              </div>

              <p className="text-sm text-dark-400 text-center">
                {t('schedule.currentView')}: <span className="text-cyber-neon font-semibold">{scheduleView === 'A' ? t('schedule.groupA') : t('schedule.groupB')}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Search Interface - Modern 2026 Design */}
        <div className="mb-8 animate-slide-up">
          <div className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80">
            <h2 className="text-2xl font-bold text-dark-100 mb-6 text-center bg-gradient-to-r from-cyber-neon to-cyber-green bg-clip-text text-transparent">
              {t('schedule.filterBySection')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end max-w-3xl mx-auto">
              <div>
                <label className="block text-sm font-semibold text-dark-200 mb-3 flex items-center gap-2">
                  <Search className="w-4 h-4 text-cyber-neon" />
                  {t('schedule.sectionNumber')}
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full px-4 py-3 bg-cyber-dark/80 border-2 border-cyber-neon/30 rounded-xl text-dark-100 focus:border-cyber-neon focus:outline-none focus:ring-4 focus:ring-cyber-neon/20 transition-all duration-300 hover:border-cyber-neon/50 font-medium"
                >
                  <option value="">{t('schedule.allSections')}</option>
                  {sections.map(section => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
                </div>
                
              <div>
                <button
                  onClick={() => {
                    if (selectedSection) {
                      handleSearch()
                    } else {
                      setValidationError('')
                    }
                  }}
                  className="w-full bg-gradient-to-r from-cyber-neon via-cyber-green to-cyber-neon bg-size-200 bg-pos-0 hover:bg-pos-100 text-dark-100 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg shadow-cyber-neon/30 active:scale-95"
                >
                  <Search className="w-5 h-5" />
                  {selectedSection ? t('schedule.filter') : t('schedule.clear')}
                </button>
              </div>
                </div>

            {validationError && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg max-w-2xl mx-auto">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-red-400 font-semibold mb-1">{t('schedule.invalidSelection')}</h4>
                    <p className="text-red-300 text-sm">{validationError}</p>
                    <p className="text-dark-300 text-xs mt-2">
                      {t('schedule.sectionRangeNote')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
                </div>

        {/* Schedule Results - Card View Only */}
        <div className="space-y-6">
          {(() => {
            if (!selectedSection) {
              return (
                <div className="enhanced-card p-8 text-center">
                  <h3 className="text-2xl font-semibold text-dark-100 mb-3">
                    {t('schedule.selectSectionPrompt')}
                  </h3>
                  <p className="text-dark-300">
                    {t('schedule.sectionRangeNote')}
                  </p>
                </div>
              )
            }

            const scheduleToShow = scheduleCards
            const groupedByDay = groupByDay(scheduleToShow)
            const dayOrder = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            const dayNames: Record<string, string> = {
              'Saturday': 'السبت',
              'Sunday': 'الأحد',
              'Monday': 'الإثنين',
              'Tuesday': 'الثلاثاء',
              'Wednesday': 'الأربعاء',
              'Thursday': 'الخميس',
              'Friday': 'الجمعة'
            }
            const holidayDays = ['Sunday', 'Thursday', 'Friday']

            return dayOrder.map(day => {
              const dayItems = groupedByDay[day] || []
              const isHoliday = holidayDays.includes(day)

              return (
                <div key={day} className="enhanced-card overflow-hidden">
                  <div className={`px-6 py-4 border-b ${
                    isHoliday 
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30' 
                      : 'bg-gradient-to-r from-cyber-neon/20 to-cyber-violet/20 border-cyber-neon/30'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Calendar className={`w-5 h-5 ${isHoliday ? 'text-yellow-400' : 'text-cyber-neon'}`} />
                      <h3 className="text-xl font-bold text-dark-100">{dayNames[day] || day}</h3>
                      {isHoliday ? (
                        <span className="ml-auto text-sm text-yellow-400 bg-yellow-500/20 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                          <PartyPopper className="w-4 h-4" />
                          {t('schedule.holiday')}
                        </span>
                      ) : (
                        <span className="ml-auto text-sm text-dark-300 bg-cyber-dark/50 px-3 py-1 rounded-full">
                          {dayItems.length} {dayItems.length === 1 ? t('schedule.subject') : t('schedule.subjects')}
                        </span>
                      )}
                </div>
              </div>

                  {isHoliday ? (
                    <div className="p-12 text-center">
                      <div className="flex justify-center mb-4">
                        <PartyPopper className="w-16 h-16 text-yellow-400" />
                      </div>
                      <h4 className="text-2xl font-semibold text-dark-200 mb-2">{t('schedule.holiday')}</h4>
                      <p className="text-dark-400">{t('schedule.noLectures')}</p>
                    </div>
                  ) : dayItems.length > 0 ? (
                    <div className="p-4 sm:p-6">
                      {(() => {
                        const sortedItems = [...dayItems].sort((a, b) => {
                          const periodA = getPeriodFromTime(a.time)
                          const periodB = getPeriodFromTime(b.time)
                          return periodA - periodB
                        })

                        return (
                          <div className="space-y-3 sm:space-y-4">
                            {sortedItems.map((item, index) => (
                              <div
                                key={item.id || `item-${index}`}
                                className={`enhanced-card p-4 sm:p-5 border-2 ${
                                  item.type === 'lecture'
                                    ? 'border-cyber-violet/40 bg-gradient-to-br from-cyber-violet/15 via-cyber-dark/50 to-cyber-violet/15'
                                    : 'border-cyber-green/40 bg-gradient-to-br from-cyber-green/15 via-cyber-dark/50 to-cyber-green/15'
                                } hover:scale-[1.02] transition-all duration-300`}
                              >
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                      <h4 className="text-lg sm:text-xl font-bold text-dark-100 mb-1">
                                        {item.title}
                                      </h4>
                                      {item.sectionNumber && (
                                        <span className="inline-block px-2 py-1 bg-cyber-green/30 text-cyber-green rounded text-xs font-bold mr-2">
                                          {t('schedule.section')} {item.sectionNumber}
                                        </span>
                                      )}
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 flex items-center gap-1.5 ${
                                      item.type === 'lecture'
                                        ? 'bg-cyber-violet/30 text-cyber-violet'
                                        : 'bg-cyber-green/30 text-cyber-green'
                                    }`}>
                                      {item.type === 'lecture' ? (
                                        <>
                                          <BookOpen className="w-3.5 h-3.5" />
                                          {t('schedule.lecture')}
                                        </>
                                      ) : (
                                        <>
                                          <FlaskConical className="w-3.5 h-3.5" />
                                          {t('schedule.lab')}
                                        </>
                                      )}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                    <div className="flex items-center gap-2 text-sm sm:text-base text-dark-200 bg-cyber-dark/30 px-3 py-2 rounded-lg">
                                      <User className="w-4 h-4 text-cyber-violet flex-shrink-0" />
                                      <span className="font-medium">{item.instructor}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm sm:text-base text-dark-200 bg-cyber-dark/30 px-3 py-2 rounded-lg">
                                      <Clock className="w-4 h-4 text-cyber-neon flex-shrink-0" />
                                      <span className="font-semibold">{item.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm sm:text-base text-dark-200 bg-cyber-dark/30 px-3 py-2 rounded-lg sm:col-span-2">
                                      <MapPin className="w-4 h-4 text-cyber-green flex-shrink-0" />
                                      <span className="font-medium">{item.location}</span>
                                    </div>
                                  </div>
                                </div>
              </div>
                            ))}
                          </div>
                        )
                      })()}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-dark-400">{t('schedule.noLectures')}</p>
                    </div>
                  )}
                </div>
              )
            })
          })()}
        </div>

        {/* Empty State */}
        {scheduleData.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <Calendar className="w-16 h-16 text-cyber-neon mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-dark-100 mb-4">
              {t('schedule.noSections')}
            </h3>
            <p className="text-dark-300">
              {t('schedule.description')}
            </p>
          </div>
        )}
      </div>
  )
}
