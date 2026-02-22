// interface for loading events from a data source (e.g., file, database, etc.)
#pragma once
#include "events/Event.hpp"
#include <vector>

class IEventStore
{
public:
    virtual ~IEventStore() = default;
    virtual std::vector<Event> loadEvents() = 0;
};