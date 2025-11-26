export interface SeedScheduleItem {
  id: string
  title: string
  time: string
  location: string
  instructor: string
  type: 'lab' | 'lecture'
  group: 'Group 1' | 'Group 2'
  sectionNumber: number | null
  day: string
}

export const seedScheduleSections: SeedScheduleItem[] = [
  { id: 's1-1', title: 'Mathematics', time: '05:10 PM - 06:10 PM', location: 'Hall F 209', instructor: 'Eng Yasmin Ibrahim', type: 'lab', group: 'Group 1', sectionNumber: 1, day: 'Monday' },
  { id: 's1-2', title: 'IT', time: '12:30 PM - 01:30 PM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab', group: 'Group 1', sectionNumber: 1, day: 'Tuesday' },
  { id: 's1-3', title: 'Physics', time: '09:00 AM - 10:00 AM', location: 'Hall G 203', instructor: 'Eng Ahmed Nashaat', type: 'lab', group: 'Group 1', sectionNumber: 1, day: 'Wednesday' },
  { id: 's1-4', title: 'IS', time: '10:10 AM - 11:10 AM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 1', sectionNumber: 1, day: 'Wednesday' },
  { id: 's1-5', title: 'DataBase', time: '11:20 AM - 12:20 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 1', sectionNumber: 1, day: 'Wednesday' },
  { id: 's2-1', title: 'Physics', time: '12:30 PM - 01:30 PM', location: 'Hall G 206', instructor: 'Eng Mohamed Mostafa', type: 'lab', group: 'Group 1', sectionNumber: 2, day: 'Saturday' },
  { id: 's2-2', title: 'IT', time: '10:10 AM - 11:10 AM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab', group: 'Group 1', sectionNumber: 2, day: 'Tuesday' },
  { id: 's2-3', title: 'Mathematics', time: '02:50 PM - 03:50 PM', location: 'Hall F 209', instructor: 'Eng Yasmin Ibrahim', type: 'lab', group: 'Group 1', sectionNumber: 2, day: 'Tuesday' },
  { id: 's2-4', title: 'IS', time: '09:00 AM - 10:00 AM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 1', sectionNumber: 2, day: 'Wednesday' },
  { id: 's2-5', title: 'DataBase', time: '10:10 AM - 11:10 AM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 1', sectionNumber: 2, day: 'Wednesday' },
  { id: 's3-1', title: 'Physics', time: '01:40 PM - 02:40 PM', location: 'Hall G 206', instructor: 'Eng Mohamed Mostafa', type: 'lab', group: 'Group 1', sectionNumber: 3, day: 'Saturday' },
  { id: 's3-2', title: 'IT', time: '02:50 PM - 03:50 PM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab', group: 'Group 1', sectionNumber: 3, day: 'Tuesday' },
  { id: 's3-3', title: 'Mathematics', time: '04:00 PM - 05:00 PM', location: 'Hall F 209', instructor: 'Eng Yasmin Ibrahim', type: 'lab', group: 'Group 1', sectionNumber: 3, day: 'Tuesday' },
  { id: 's3-4', title: 'DataBase', time: '09:00 AM - 10:00 AM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 1', sectionNumber: 3, day: 'Wednesday' },
  { id: 's3-5', title: 'IS', time: '12:30 PM - 01:30 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 1', sectionNumber: 3, day: 'Wednesday' },
  { id: 's4-1', title: 'Physics', time: '02:50 PM - 03:50 PM', location: 'Hall G 206', instructor: 'Eng Mohamed Mostafa', type: 'lab', group: 'Group 1', sectionNumber: 4, day: 'Saturday' },
  { id: 's4-2', title: 'IT', time: '12:30 PM - 01:30 PM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab', group: 'Group 1', sectionNumber: 4, day: 'Monday' },
  { id: 's4-3', title: 'Mathematics', time: '01:40 PM - 02:40 PM', location: 'Hall G 105', instructor: 'Eng Ahmed Nashaat', type: 'lab', group: 'Group 1', sectionNumber: 4, day: 'Monday' },
  { id: 's4-4', title: 'IS', time: '11:20 AM - 12:20 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 1', sectionNumber: 4, day: 'Wednesday' },
  { id: 's4-5', title: 'DataBase', time: '12:30 PM - 01:30 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 1', sectionNumber: 4, day: 'Wednesday' },
  { id: 's5-1', title: 'IS', time: '10:10 AM - 11:10 AM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 1', sectionNumber: 5, day: 'Monday' },
  { id: 's5-2', title: 'Mathematics', time: '02:50 PM - 03:50 PM', location: 'Hall G 105', instructor: 'Eng Ahmed Nashaat', type: 'lab', group: 'Group 1', sectionNumber: 5, day: 'Monday' },
  { id: 's5-3', title: 'IT', time: '04:00 PM - 05:00 PM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab', group: 'Group 1', sectionNumber: 5, day: 'Tuesday' },
  { id: 's5-4', title: 'DataBase', time: '01:40 PM - 02:40 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 1', sectionNumber: 5, day: 'Wednesday' },
  { id: 's6-1', title: 'IT', time: '10:10 AM - 11:10 AM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab', group: 'Group 1', sectionNumber: 6, day: 'Monday' },
  { id: 's6-2', title: 'DataBase', time: '02:50 PM - 03:50 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 1', sectionNumber: 6, day: 'Monday' },
  { id: 's6-3', title: 'Mathematics', time: '05:10 PM - 06:10 PM', location: 'Hall G 105', instructor: 'Eng Ahmed Nashaat', type: 'lab', group: 'Group 1', sectionNumber: 6, day: 'Monday' },
  { id: 's6-4', title: 'IS', time: '02:50 PM - 03:50 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 1', sectionNumber: 6, day: 'Wednesday' },
  { id: 's7-1', title: 'Mathematics', time: '12:30 PM - 01:30 PM', location: 'Hall G 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 1', sectionNumber: 7, day: 'Saturday' },
  { id: 's7-2', title: 'DataBase', time: '10:10 AM - 11:10 AM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 1', sectionNumber: 7, day: 'Monday' },
  { id: 's7-3', title: 'IT', time: '01:40 PM - 02:40 PM', location: 'Hall D 101', instructor: 'Eng Mohamed Ammar', type: 'lab', group: 'Group 1', sectionNumber: 7, day: 'Monday' },
  { id: 's7-4', title: 'IS', time: '01:40 PM - 02:40 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 1', sectionNumber: 7, day: 'Wednesday' },
  { id: 's8-1', title: 'IT', time: '09:00 AM - 10:00 AM', location: 'Hall D 102', instructor: 'Eng Mohamed Mostafa', type: 'lab', group: 'Group 2', sectionNumber: 8, day: 'Saturday' },
  { id: 's8-2', title: 'Mathematics', time: '01:40 PM - 02:40 PM', location: 'Hall G 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 8, day: 'Saturday' },
  { id: 's8-3', title: 'DataBase', time: '09:00 AM - 10:00 AM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 2', sectionNumber: 8, day: 'Monday' },
  { id: 's8-4', title: 'IS', time: '11:20 AM - 12:20 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 8, day: 'Monday' },
  { id: 's9-1', title: 'IT', time: '10:10 AM - 11:10 AM', location: 'Hall D 102', instructor: 'Eng Mohamed Mostafa', type: 'lab', group: 'Group 2', sectionNumber: 9, day: 'Saturday' },
  { id: 's9-2', title: 'Mathematics', time: '02:50 PM - 03:50 PM', location: 'Hall G 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 9, day: 'Saturday' },
  { id: 's9-3', title: 'IS', time: '12:30 PM - 01:30 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 9, day: 'Monday' },
  { id: 's9-4', title: 'DataBase', time: '01:40 PM - 02:40 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 2', sectionNumber: 9, day: 'Monday' },
  { id: 's10-1', title: 'IT', time: '11:20 AM - 12:20 PM', location: 'Hall D 102', instructor: 'Eng Mohamed Mostafa', type: 'lab', group: 'Group 2', sectionNumber: 10, day: 'Saturday' },
  { id: 's10-2', title: 'DataBase', time: '11:20 AM - 12:20 PM', location: 'Hall D 103', instructor: 'Eng Kareem Adel', type: 'lab', group: 'Group 2', sectionNumber: 10, day: 'Monday' },
  { id: 's10-3', title: 'IS', time: '01:40 PM - 02:40 PM', location: 'Hall D 103', instructor: 'Eng Mahmoud Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 10, day: 'Monday' },
  { id: 's10-4', title: 'Physics', time: '05:10 PM - 06:10 PM', location: 'Hall F 205', instructor: 'Eng Omnia Ibrahim', type: 'lab', group: 'Group 2', sectionNumber: 10, day: 'Monday' },
  { id: 's11-1', title: 'Mathematics', time: '05:10 PM - 06:10 PM', location: 'Hall G 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 11, day: 'Saturday' },
  { id: 's11-2', title: 'IT', time: '09:00 AM - 10:00 AM', location: 'Hall D 102', instructor: 'Eng Mohamed Mostafa', type: 'lab', group: 'Group 2', sectionNumber: 11, day: 'Monday' },
  { id: 's11-3', title: 'Data Base', time: '11:20 AM - 12:20 PM', location: 'Hall D 101', instructor: 'Eng Nagla Saeed', type: 'lab', group: 'Group 2', sectionNumber: 11, day: 'Monday' },
  { id: 's11-4', title: 'Physics', time: '04:00 PM - 05:00 PM', location: 'Hall F 205', instructor: 'Eng Omnia Ibrahim', type: 'lab', group: 'Group 2', sectionNumber: 11, day: 'Tuesday' },
  { id: 's11-5', title: 'IS', time: '01:40 PM - 02:40 PM', location: 'Hall D 102', instructor: 'Eng Dina Ali', type: 'lab', group: 'Group 2', sectionNumber: 11, day: 'Wednesday' },
  { id: 's12-1', title: 'Data Base', time: '09:00 AM - 10:00 AM', location: 'Hall D 101', instructor: 'Eng Nagla Saeed', type: 'lab', group: 'Group 2', sectionNumber: 12, day: 'Monday' },
  { id: 's12-2', title: 'IT', time: '12:30 PM - 01:30 PM', location: 'Hall D 102', instructor: 'Eng Mohamed Mostafa', type: 'lab', group: 'Group 2', sectionNumber: 12, day: 'Monday' },
  { id: 's12-3', title: 'Mathematics', time: '04:00 PM - 05:00 PM', location: 'Hall F 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 12, day: 'Monday' },
  { id: 's12-4', title: 'Physics', time: '05:10 PM - 06:10 PM', location: 'Hall F 205', instructor: 'Eng Omnia Ibrahim', type: 'lab', group: 'Group 2', sectionNumber: 12, day: 'Tuesday' },
  { id: 's12-5', title: 'IS', time: '12:30 PM - 01:30 PM', location: 'Hall D 101', instructor: 'Eng Mariam Ashraf', type: 'lab', group: 'Group 2', sectionNumber: 12, day: 'Wednesday' },
  { id: 's13-1', title: 'Physics', time: '04:00 PM - 05:00 PM', location: 'Hall F 205', instructor: 'Eng Omnia Ibrahim', type: 'lab', group: 'Group 2', sectionNumber: 13, day: 'Monday' },
  { id: 's13-2', title: 'Mathematics', time: '05:10 PM - 06:10 PM', location: 'Hall F 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 13, day: 'Monday' },
  { id: 's13-3', title: 'Data Base', time: '04:00 PM - 05:00 PM', location: 'Hall D 102', instructor: 'Eng Nagla Saeed', type: 'lab', group: 'Group 2', sectionNumber: 13, day: 'Tuesday' },
  { id: 's13-4', title: 'IS', time: '09:00 AM - 10:00 AM', location: 'Hall D 101', instructor: 'Eng Mariam Ashraf', type: 'lab', group: 'Group 2', sectionNumber: 13, day: 'Wednesday' },
  { id: 's14-1', title: 'Physics', time: '01:40 PM - 02:40 PM', location: 'Hall F 108', instructor: 'Eng Omnia Ibrahim', type: 'lab', group: 'Group 2', sectionNumber: 14, day: 'Monday' },
  { id: 's14-2', title: 'Data Base', time: '05:10 PM - 06:10 PM', location: 'Hall D 102', instructor: 'Eng Nagla Saeed', type: 'lab', group: 'Group 2', sectionNumber: 14, day: 'Monday' },
  { id: 's14-3', title: 'IS', time: '11:20 AM - 12:20 PM', location: 'Hall D 101', instructor: 'Eng Mariam Ashraf', type: 'lab', group: 'Group 2', sectionNumber: 14, day: 'Wednesday' },
  { id: 's14-4', title: 'Mathematics', time: '02:50 PM - 03:50 PM', location: 'Hall F 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 14, day: 'Wednesday' },
  { id: 's15-1', title: 'Data Base', time: '04:00 PM - 05:00 PM', location: 'Hall D 101', instructor: 'Eng Nagla Saeed', type: 'lab', group: 'Group 2', sectionNumber: 15, day: 'Monday' },
  { id: 's15-2', title: 'Physics', time: '01:40 PM - 02:40 PM', location: 'Hall F 108', instructor: 'Eng Omnia Ibrahim', type: 'lab', group: 'Group 2', sectionNumber: 15, day: 'Tuesday' },
  { id: 's15-3', title: 'IS', time: '10:10 AM - 11:10 AM', location: 'Hall D 101', instructor: 'Eng Mariam Ashraf', type: 'lab', group: 'Group 2', sectionNumber: 15, day: 'Wednesday' },
  { id: 's15-4', title: 'Mathematics', time: '04:00 PM - 05:00 PM', location: 'Hall F 207', instructor: 'Eng Ehab Mohamed', type: 'lab', group: 'Group 2', sectionNumber: 15, day: 'Wednesday' },
]

export const seedScheduleLectures: SeedScheduleItem[] = [
  { id: '1', title: 'English', time: '11:20 AM - 12:20 PM', location: 'Hall G 205', instructor: 'Dr. Sabreen', type: 'lecture', group: 'Group 1', sectionNumber: null, day: 'Saturday' },
  { id: '2', title: 'Information Systems', time: '09:00 AM - 10:00 AM', location: 'Hall G 205', instructor: 'Dr. Hind Ziada', type: 'lecture', group: 'Group 1', sectionNumber: null, day: 'Monday' },
  { id: '3', title: 'Information Technology', time: '04:00 PM - 05:00 PM', location: 'Auditorium A', instructor: 'Dr. Shaima Ahmed', type: 'lecture', group: 'Group 1', sectionNumber: null, day: 'Monday' },
  { id: '4', title: 'Entrepreneurship and Creative Thinking Skills', time: '09:00 AM - 10:00 AM', location: 'Auditorium A', instructor: 'Dr. Abeer Hassan', type: 'lecture', group: 'Group 1', sectionNumber: null, day: 'Tuesday' },
  { id: '5', title: 'Database Systems', time: '11:20 AM - 12:20 PM', location: 'Auditorium A', instructor: 'Dr. Abeer Hassan', type: 'lecture', group: 'Group 1', sectionNumber: null, day: 'Tuesday' },
  { id: '6', title: 'Mathematics', time: '01:40 PM - 02:40 PM', location: 'Auditorium A', instructor: 'Dr. Simon Ezzat', type: 'lecture', group: 'Group 1', sectionNumber: null, day: 'Tuesday' },
  { id: '7', title: 'Applied Physics', time: '04:00 PM - 05:00 PM', location: 'Auditorium A', instructor: 'Dr. Ahmed Bakr', type: 'lecture', group: 'Group 1', sectionNumber: null, day: 'Wednesday' },
  { id: '8', title: 'English', time: '12:30 PM - 01:30 PM', location: 'Hall G 205', instructor: 'Dr. Sabreen', type: 'lecture', group: 'Group 2', sectionNumber: null, day: 'Saturday' },
  { id: '9', title: 'Information Systems', time: '10:10 AM - 11:10 AM', location: 'Hall G 205', instructor: 'Dr. Hind Ziada', type: 'lecture', group: 'Group 2', sectionNumber: null, day: 'Monday' },
  { id: '10', title: 'Information Technology', time: '02:50 PM - 03:50 PM', location: 'Auditorium A', instructor: 'Dr. Shaima Ahmed', type: 'lecture', group: 'Group 2', sectionNumber: null, day: 'Monday' },
  { id: '11', title: 'Entrepreneurship and Creative Thinking Skills', time: '10:10 AM - 11:10 AM', location: 'Auditorium A', instructor: 'Dr. Abeer Hassan', type: 'lecture', group: 'Group 2', sectionNumber: null, day: 'Tuesday' },
  { id: '12', title: 'Database Systems', time: '12:30 PM - 01:30 PM', location: 'Auditorium A', instructor: 'Dr. Abeer Hassan', type: 'lecture', group: 'Group 2', sectionNumber: null, day: 'Tuesday' },
  { id: '13', title: 'Mathematics', time: '02:50 PM - 03:50 PM', location: 'Auditorium A', instructor: 'Dr. Simon Ezzat', type: 'lecture', group: 'Group 2', sectionNumber: null, day: 'Tuesday' },
  { id: '14', title: 'Applied Physics', time: '05:10 PM - 06:10 PM', location: 'Auditorium A', instructor: 'Dr. Ahmed Bakr', type: 'lecture', group: 'Group 2', sectionNumber: null, day: 'Wednesday' },
]


