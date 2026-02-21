#include "platform/MockPlatform.hpp"
#include <chrono>
#include <ctime>
#include <iomanip>
#include <sstream>

MockPlatform::MockPlatform(ILogger& logger) : m_logger(logger) {}

bool MockPlatform::vaultIsInitialized() { return true; }
bool MockPlatform::isBatterySafe() { return true; }
bool MockPlatform::isDndDisabled() { return true; }

std::string MockPlatform::nowLocalHHMM()
{
    auto now = std::chrono::system_clock::now();
    std::time_t t = std::chrono::system_clock::to_time_t(now);
    std::tm tm = *std::localtime(&t);

    std::ostringstream oss;
    oss << std::setw(2) << std::setfill('0') << tm.tm_hour
        << ":" << std::setw(2) << std::setfill('0') << tm.tm_min;
    return oss.str();
}

std::string MockPlatform::todayISODate()
{
    auto now = std::chrono::system_clock::now();
    std::time_t t = std::chrono::system_clock::to_time_t(now);
    std::tm tm = *std::localtime(&t);

    std::ostringstream oss;
    oss << (tm.tm_year + 1900) << "-"
        << std::setw(2) << std::setfill('0') << (tm.tm_mon + 1) << "-"
        << std::setw(2) << std::setfill('0') << tm.tm_mday;
    return oss.str();
}

void MockPlatform::showCallNotification()
{
    m_logger.info("[Android] CallStyle notification shown (stub)");
}
void MockPlatform::clearCallNotification()
{
    m_logger.info("[Android] Call notification cleared (stub)");
}
void MockPlatform::startRingtoneAndVibration()
{
    m_logger.info("[Android] Ringtone + vibration started (stub)");
}
void MockPlatform::stopRingtoneAndVibration()
{
    m_logger.info("[Android] Ringtone + vibration stopped (stub)");
}

void MockPlatform::appendToDailyNoteMarkdown(const std::string& dateISO, const std::string& line)
{
    m_logger.info("[SAF] Append to " + dateISO + ".md -> " + line);
}

void MockPlatform::saveVoiceMemoPlaceholder(const std::string& fileName)
{
    m_logger.info("[SAF] Save voice memo placeholder: " + fileName);
}
DayOfWeek MockPlatform::todayDayOfWeek()
{
    // stub: pretend it's Monday
    return DayOfWeek::Mon;
}

TimeOfDay MockPlatform::nowTimeOfDay()
{
    // stub: pretend it's 18:30
    return TimeOfDay{18, 30};
}