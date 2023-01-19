import json

courses = json.load(open('courses.json'))
condensed_courses = {}

for course in courses:
    meets = set()
    for section in course['sections']:
        for time in section['meetingTimes']:
            if time['startMinute'] is None:
                continue
            meets.add(
                (
                    time['campusName'], 
                    time['buildingCode'], 
                    time['roomNumber'], 
                    time['meetingDay'], 
                    time['startMinute'],
                    time['endMinute']
                )
            )
    
    if len(meets) == 0:
        continue
    condensed_courses[course['title']] = []
    for cn, bc, rn, md, sm, em in meets:
        temp = {}
        temp['campusName'] = cn
        temp['buildingCode'] = bc
        temp['roomNumber'] = rn
        temp['meetingDay'] = md
        temp['startMinute'] = sm
        temp['endMinute'] = em
        condensed_courses[course['title']].append(temp)
    
json.dump(condensed_courses, open('times.json', 'w'))