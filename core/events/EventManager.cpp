#include "events/EventManager.hpp"

EventManager::EventManager(IPlatform& platform, ILogger& logger, IEventStore& store)
    : m_platform(platform), m_logger(logger), m_store(store)
{
}

bool EventManager::isWithinWindow(int nowMin, int startMin, int endMin)
{
    // Handles normal window: start <= now < end
    // Handles overnight window: start > end 
    if (startMin == endMin)
        return false; // treat as empty window

    if (startMin < endMin)
        return (nowMin >= startMin && nowMin < endMin);

    // Overnight
    return (nowMin >= startMin || nowMin < endMin);
}

std::optional<std::string> EventManager::getActiveEventName()
{
    // Platform provides current day and time.
    DayOfWeek today = m_platform.todayDayOfWeek();
    TimeOfDay now   = m_platform.nowTimeOfDay();

    const int dayIdx = static_cast<int>(today);
    const int nowMin = now.toMinutes();

    auto events = m_store.loadEvents();

    for (const auto& e : events)
    {
        if (!e.enabled)
            continue;

        if (dayIdx < 0 || dayIdx >= 7 || !e.recurrence[dayIdx])
            continue;

        const int startMin = e.start.toMinutes();
        const int endMin   = e.end.toMinutes();

        if (isWithinWindow(nowMin, startMin, endMin))
            return e.name;
    }

    return std::nullopt;
}
