#include "call/CallController.hpp"

CallController::CallController(IPlatform& platform, ILogger& logger)
    : m_platform(platform), m_logger(logger)
{
}

void CallController::startIncomingCall()
{
    m_logger.info("[Call] startIncomingCall()");
    m_platform.showCallNotification();
    m_platform.startRingtoneAndVibration();
}

void CallController::autoLogEvent(const std::string& eventName)
{
    m_logger.info("[Call] autoLogEvent(): " + eventName);

    //Later this becomes a proper markdown table row.
    const std::string line = "- " + m_platform.nowLocalHHMM() + " " + eventName;

    m_platform.appendToDailyNoteMarkdown(m_platform.todayISODate(), line);
}