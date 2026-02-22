#include "events/MemoryEventStore.hpp"

std::vector<Event> MemoryEventStore::loadEvents()
{
    Event study;
    study.name = "Study Block";
    study.enabled = true;
    study.recurrence.fill(false);
    study.recurrence[static_cast<int>(DayOfWeek::Mon)] = true;
    study.recurrence[static_cast<int>(DayOfWeek::Wed)] = true;
    study.recurrence[static_cast<int>(DayOfWeek::Fri)] = true;
    study.start = TimeOfDay{18, 0};
    study.end   = TimeOfDay{20, 0};

    Event gym;
    gym.name = "Gym";
    gym.enabled = true;
    gym.recurrence.fill(false);
    gym.recurrence[static_cast<int>(DayOfWeek::Tue)] = true;
    gym.recurrence[static_cast<int>(DayOfWeek::Thu)] = true;
    gym.start = TimeOfDay{7, 0};
    gym.end   = TimeOfDay{8, 0};

    return {study, gym};
}