// Temperarey file for testing the MemoryEventStore implementation. This file will be deleted after testing is complete.
#pragma once
#include "events/EventStore.hpp"

class MemoryEventStore : public IEventStore
{
public:
    std::vector<Event> loadEvents() override;
};