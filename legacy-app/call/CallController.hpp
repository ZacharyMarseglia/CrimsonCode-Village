#pragma once
#include "core/IPlatform.hpp"
#include "logging/ILogger.hpp"
#include "scheduler/TriggerService.hpp" 
#include <string>

class CallController : public ICallActions
{
public:
    CallController(IPlatform& platform, ILogger& logger);

    void startIncomingCall() override;
    void autoLogEvent(const std::string& eventName) override;

private:
    IPlatform& m_platform;
    ILogger& m_logger;
};