#include "scheduler/TriggerService.hpp"

TriggerService::TriggerService(IPlatform& platform, ILogger& logger, EventManager& events, ICallActions& call)
    : m_platform(platform), m_logger(logger), m_events(events), m_call(call)
{
}

void TriggerService::runTrigger()
{
    // requires vault setup
    if (!m_platform.vaultIsInitialized())
    {
        m_logger.info("[Trigger] Vault not initialized -> skip");
        return;
    }

    // bypass battery + DND checks, no notification
    if (auto activeEvent = m_events.getActiveEventName(); activeEvent.has_value())
    {
        m_logger.info("[Trigger] Event override -> auto-log: " + activeEvent.value());
        m_call.autoLogEvent(activeEvent.value());
        return;
    }

    // Battery Level: skip if < 5%
    if (!m_platform.isBatterySafe())
    {
        m_logger.info("[Trigger] Battery too low -> skip");
        return;
    }

    // skip if any DND mode
    if (!m_platform.isDndDisabled())
    {
        m_logger.info("[Trigger] DND active -> skip");
        return;
    }

    // start call experience
    m_logger.info("[Trigger] Starting call interaction");
    m_call.startIncomingCall();
}