#pragma once
#include "core/IPlatform.hpp"
#include "core/ILogger.hpp"
#include "events/EventManager.hpp"

class ICallActions
{
public:
    virtual ~ICallActions() = default;

    // Starts call notification + full-screen intent + alerts
    virtual void startIncomingCall() = 0;

    // Auto-log without notification (event override behavior)
    virtual void autoLogEvent(const std::string& eventName) = 0;
};

class TriggerService
{
public:
    TriggerService(IPlatform& platform, ILogger& logger, EventManager& events, ICallActions& call);

    // Called on each alarm tick
    void runTrigger();

private:
    IPlatform& m_platform;
    ILogger& m_logger;
    EventManager& m_events;
    ICallActions& m_call;
};