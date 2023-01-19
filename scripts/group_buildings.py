import json
from collections import defaultdict
from flatten_dict import unflatten

times = json.load(open('../times.json'))
by_building = defaultdict(set)

for course in times.values():
    for time in course:
        if time['campusName'] == 'Online' or time['buildingCode'] == '':
            continue
        by_building[(
            time['campusName'],
            time['buildingCode'],
            time['roomNumber'],
            time['meetingDay']
        )].add((int(time['startMinute']), int(time['endMinute'])))

by_building = {k:sorted(list(by_building[k])) for k in sorted(by_building)}
by_building = unflatten(by_building)

json.dump(by_building, open('rooms.js', 'w'))