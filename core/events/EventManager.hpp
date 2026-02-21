#pragma once
#include "core/IPlatform.hpp"
#include "core/ILogger.hpp"
#include "events/EventStore.hpp"
#include "events/Event.hpp"
#include <optional>
#include <string>
#include <vector>

class EventManager
{
public:
    EventManager(IPlatform& platform, ILogger& logger, IEventStore& store);

    // Returns active event name if within any enabled event window.
    std::optional<std::string> getActiveEventName();

private:
    IPlatform& m_platform;
    ILogger& m_logger;
    IEventStore& m_store;

    static bool isWithinWindow(int nowMin, int startMin, int endMin);
};